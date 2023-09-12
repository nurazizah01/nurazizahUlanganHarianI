const readline = require('readline');

// Membuat objek untuk membaca input dari pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Data inventaris barang
const inventory = [
  { id: '1', name: 'mie instan', price: 25, stock: 96 },
  { id: '2', name: 'rokok', price: 15, stock: 90 },
  { id: '3', name: 'panci', price: 10, stock: 55 }
];

// Riwayat penjualan
const salesHistory = [];
// Total penjualan
let totalSales = 0;

// Fungsi untuk menampilkan inventaris
function displayInventory() {
  console.log('\nInventaris barang:');
  for (const item of inventory) {
    console.log(`ID: ${item.id}, Nama: ${item.name}, Harga: $${item.price}, Stok: ${item.stock}`);
  }
}

// Fungsi untuk menambahkan item ke inventaris
function addItem(id, name, price, stock) {
  inventory.push({ id, name, price, stock });
  console.log(`Item ${name} telah ditambahkan ke inventaris.`);
}

// Fungsi untuk mengupdate harga produk
function updatePrice(id, newPrice) {
  const item = inventory.find(item => item.id === id);
  if (item) {
    item.price = newPrice;
    console.log(`Harga ${item.name} telah diperbarui menjadi $${newPrice}.`);
  } else {
    console.log('Produk tidak ditemukan.');
  }
}

// Fungsi untuk memproses pesanan pelanggan
function processOrder(order) {
  let total = 0;
  for (const item of order) {
    const product = inventory.find(product => product.id === item.id);
    if (product && product.stock >= item.quantity) {
      product.stock -= item.quantity;
      total += product.price * item.quantity;
      salesHistory.push({ name: product.name, price: product.price, quantity: item.quantity });
      console.log(`Terima kasih atas pesanan Anda: ${product.name} x ${item.quantity}`);
    } else if (product) {
      console.log(`Maaf, stok ${product.name} tidak mencukupi untuk pesanan Anda.`);
    } else {
      console.log('Produk anda tidak ditemukan.');
    }
  }
  totalSales += total;
  return total;
}

// Fungsi untuk menampilkan riwayat penjualan
function displaySalesHistory() {
  console.log('\nRiwayat Penjualan:');
  for (const item of salesHistory) {
    console.log(`Item: ${item.name}, Harga: $${item.price}, Jumlah: ${item.quantity}`);
  }
}

// Menu utama program
function mainMenu() {
    console.log('Selamat datang di Minimarket Management System');
  console.log('1. Tampilkan Inventaris Produk');
  console.log('2. Terima Pesanan Pelanggan');
  console.log('3. Update Harga Produk');
  console.log('4. Tampilkan Riwayat Pembelian Pelanggan');
  console.log('5. Keluar');
  rl.question('Pilih opsi (1/2/3/4/5): ', function (choice) {
    switch (choice) {
      case '1':
        rl.question('Masukkan ID Produk: ', function (id) {
          rl.question('Masukkan Nama Produk: ', function (name) {
            rl.question('Masukkan Harga Produk: ', function (price) {
              rl.question('Masukkan Stok Produk: ', function (stock) {
                addItem(id, name, parseFloat(price), parseInt(stock));
                mainMenu();
              });
            });
          });
        });
        break;
      case '2':
        rl.question('Masukkan ID Produk yang akan diperbarui harganya: ', function (id) {
          rl.question('Masukkan Harga Baru: ', function (newPrice) {
            updatePrice(id, parseFloat(newPrice));
            mainMenu();
          });
        });
        break;
      case '3':
        const order = [];
        function processOrderInput() {
          rl.question('Masukkan ID Produk yang dipesan (5 untuk selesai): ', function (id) {
            if (id === '5') {
              const total = processOrder(order);
              console.log(`Total Penjualan: $${total}`);
              mainMenu();
            } else {
              const product = inventory.find(product => product.id === id);
              if (product) {
                rl.question(`Masukkan Jumlah Pesanan untuk ${product.name}: `, function (quantity) {
                  order.push({ id, quantity: parseInt(quantity) });
                  processOrderInput();
                });
              } else {
                console.log('Produk tidak ditemukan.');
                processOrderInput();
              }
            }
          });
        }
        processOrderInput();
        break;
      case '4':
        displayInventory();
        mainMenu();
        break;
      case '5':
        displaySalesHistory();
        mainMenu();
        break;
      default:
        console.log('Pilihan tidak valid. Silakan coba lagi.');
        mainMenu();
        break;
    }
  });
}

// Memulai program dengan menampilkan menu utama
mainMenu()