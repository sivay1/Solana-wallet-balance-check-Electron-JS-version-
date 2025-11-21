document.getElementById("checkBtn").addEventListener("click", async () => {
  const wallet = document.getElementById("wallet").value.trim();
  const resultBox = document.getElementById("result");

  resultBox.innerText = "";
   

  try{
    const data = await window.api.checkBalance(wallet);

    if (data.error) {
      resultBox.innerText = "Error: " + data.error;
    } else {
      resultBox.innerHTML = `
        SOL: ${data.sol}<br>
        USD Value: $${data.usdc}
      `;
    }
  }catch(error){
    resultBox.innerText = "Error: " + error.message;
  }
  console.log("window.api =", window.api);

});
