import { useState } from "react";
import { NFTStorage, File } from "nft.storage";

const nftStorage = new NFTStorage({
  token: process.env.REACT_APP_NFT_STORAGE_KEY,
});

const myStyle = {
  padding: '15px 32px',
  backgroundColor: 'lightblue',
  border: '1px solid #ddd',
  color: 'white',
  borderRadius: 10,
  fontSize: 10,
  display: 'inline-block'
}

const mystyle = {
  border: '2px solid red',
  borderRadius: '4px',
  fontSize: 40,
  width: '800px',
  height: '40px'
}

const store = async (name, description, data, fileName, type) => {
  const metadata = await nftStorage.store({
    name,
    description,
    image: new File([data], fileName, { type }),
  });
  console.log(metadata);
  return metadata;
};

export const ERC721Minter = ({ bunzz, userAddress }) => {
  const [blob, setBlob] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [base64, setBase64] = useState(null);
  const [onGoing, setOnGoing] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [type, setType] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const select = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      readAsBlob(file);
      readAsBase64(file);
      setType(file.type);
      setFileName(file.name);
    }
  };

  const readAsBlob = (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      console.log(reader.result);
      setBlob(reader.result);
    };
  };

  const readAsBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setBase64(reader.result);
    };
  };

  const submit = async () => {
    setOnGoing(true);
    try {
      const metadata = await store(name, description, blob, fileName, type);
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const inputUrl = metadata.url.replace(/^ipfs:\/\//, "");

      const tx = await contract.safeMint(userAddress, inputUrl);
      const receipt = await tx.wait();
      console.log(receipt);

      const event = receipt.events[0];
      const _tokenId = event.args[2];
      setTokenId(_tokenId);
      setBase64(null);
      window.alert("Minted successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">
        Mint your NFT with <span1> &nbsp;IPFS <br /> 
    &nbsp;BUNZZ</span1>
      </h1><br />
     <p>Step1: Choose a token name, add the description and select a file</p> 
      <input className="form-inline"

      style={mystyle}
        placeholder="Token Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      /> <br />
      <textarea className="form-inline"

      style={mystyle}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
      /> <br />
      <input type="file" accept="image/*" onChange={select} />
      {base64 ? (
          <img src={base64} alt="hoge" className="image" />
      ) : (
        <></> 
      )} <br />
      {onGoing ? (
        <div className="center">
          Loading...
        </div>
      ) : (
        <button 
        
      style={myStyle}
        
        onClick={submit}>
          <h1>Mint</h1>
        </button>
      )}
      {tokenId ? <p>token ID: {tokenId}</p> : <></>}
    </div>
  );
};
