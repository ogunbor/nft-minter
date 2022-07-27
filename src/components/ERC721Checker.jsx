import { useState } from "react";

export const ERC721Checker = ({ bunzz, userAddress }) => {
  const [tokenId, setTokenId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [onGoing, setOnGoing] = useState(false);

  const submit = async () => {
    setOnGoing(true);
    try {
      const contract = await bunzz.getContract("NFT (IPFS Mintable)");
      const { data: tokenUri } = await contract.tokenURI(tokenId);
      const url = tokenUri.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/");
      const res = await fetch(url);
      const data = await res.json();
      setName(data.name);
      setDescription(data.description);
      setImage(data.image.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/"));
    } catch (err) {
      console.error(err);
    } finally {
      setOnGoing(false);
    }
  };

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

  return (
    <div className="wrapper">
      <p> Step2: Get your NFT</p>
      <input

        style={mystyle}
        placeholder="token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}  
        type="text"
      />  <br /> 
      {onGoing ? (
        <div className="center">Loading...</div>
      ) : (
        <button 
        
        style={myStyle}
        
        onClick={submit}>
<h1>Get</h1>

        </button>
      )}
      {name ? <p>Name: {name}</p> : <></>}  <br /> <br /> <br />
      {description ? <p>Description: {description}</p> : <></>} <br /> <br />
      {image ? <img src={image} alt="image" className="image" /> : <></>}
    </div> 
  ); 
};
