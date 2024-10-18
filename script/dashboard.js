// delivery.js
document.getElementById('deliveryForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const destination = document.getElementById('destination').value;
    const units = document.getElementById('units').value;
    const drugType = document.getElementById('drugType').value;

    const response = await fetch('/create-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, units, drugType })
    });
            // Sidebar toggle
            const menuBtn = document.getElementById('menuBtn');
            const sidebar = document.getElementById('sidebar');
            const chatbotIcon = document.getElementById('chatbotIcon');
    
            menuBtn.addEventListener('click', function () {
                menuBtn.classList.toggle('open');
                sidebar.classList.toggle('active');
            });
    
            document.addEventListener('click', function (event) {
                if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
                    sidebar.classList.remove('active');
                    menuBtn.classList.remove('open');
                }
            });
    
            sidebar.addEventListener('click', function (event) {
                event.stopPropagation();
            });
    

    const result = await response.json();
    if (result.success) {
        document.getElementById('status').innerText = 'NFT created successfully.';
        document.getElementById('confirmButton').innerText = 'Load Your Units';
    } else {
        document.getElementById('status').innerText = 'Error creating NFT.';
    }
});
