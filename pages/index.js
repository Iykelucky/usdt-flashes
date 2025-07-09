import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const contractAddress = "0xfD27Ce32fA5E7636dD23A503a63e88043a7391Ae";
  const abi = [
    "function mint(address to, uint256 amount) public",
    "function balanceOf(address) view returns (uint256)"
  ];

  const mint = async () => {
    if (!window.ethereum) return alert("Use MetaMask or Trust Wallet browser");
    setLoading(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = await contract.mint(walletAddress, ethers.parseUnits("100000", 6));
    await tx.wait();
    alert("100,000 USDT minted!");
    setLoading(false);
  };

  const checkBalance = async () => {
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const rawBal = await contract.balanceOf(walletAddress);
    const formatted = ethers.formatUnits(rawBal, 6);
    setBalance(formatted);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Fake USDT Dashboard</h1>
      <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} placeholder="Wallet address" />
      <button onClick={mint}>Mint 100,000 USDT</button>
      <button onClick={checkBalance}>Check Balance</button>
      {balance && <p>Balance: ${balance}</p>}
    </div>
  );
}
