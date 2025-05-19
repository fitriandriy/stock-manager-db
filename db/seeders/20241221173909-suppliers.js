'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Suppliers', [
      {
        "id": 0,
        "name": "Others",
        "address": "Gudang"
      },
      {
        "id": 1,
        "name": "Sunyoto",
        "address": "Taman Agung"
      },
      {
        "id": 2,
        "name": "A Giat",
        "address": "Kraksaan"
      },
      {
        "id": 3,
        "name": "Dwi",
        "address": "Ponorogo"
      },
      {
        "id": 4,
        "name": "Samen",
        "address": "Tuban"
      },
      {
        "id": 5,
        "name": "Merdeka",
        "address": "Kali Putih"
      },
      {
        "id": 6,
        "name": "Deo",
        "address": "Pedotan"
      },
      {
        "id": 7,
        "name": "SMM",
        "address": "Genteng"
      },
      {
        "id": 8,
        "name": "Bulog KOM",
        "address": "Wonosobo"
      },
      {
        "id": 9,
        "name": "Cong Ming",
        "address": "Singojuruh"
      },
      {
        "id": 10,
        "name": "Sumber Tani",
        "address": "Lumajang"
      },
      {
        "id": 11,
        "name": "Maron Jaya",
        "address": "Probolinggo"
      },
      {
        "id": 12,
        "name": "Surya Mas",
        "address": "Jajag"
      },
      {
        "id": 13,
        "name": "Karunia Alam",
        "address": "Situbondo"
      },
      {
        "id": 14,
        "name": "Arta Buana",
        "address": "Situbondo"
      },
      {
        "id": 15,
        "name": "Rajin Jaya",
        "address": "Jember"
      },
      {
        "id": 16,
        "name": "Ardiansa",
        "address": "Sulsel"
      },
      {
        "id": 17,
        "name": "Aris",
        "address": "Temuguruh"
      },
      {
        "id": 18,
        "name": "Bulog Bojonegoro",
        "address": "Bojonegoro"
      },
      {
        "id": 19,
        "name": "Bulog Kom",
        "address": "Wonosobo"
      },
      {
        "id": 20,
        "name": "MKP Yoga",
        "address": "Bojonegoro"
      },
      {
        "id": 21,
        "name": "Bulog MRMP",
        "address": "Banyuwangi"
      },
      {
        "id": 22,
        "name": "Christian",
        "address": "Kembiritan"
      },
      {
        "id": 23,
        "name": "Lamdan",
        "address": "Jember"
      },
      {
        "id": 24,
        "name": "Darso",
        "address": "Parijatah"
      },
      {
        "id": 25,
        "name": "Diska",
        "address": "Magetan"
      },
      {
        "id": 26,
        "name": "Edya Jaya",
        "address": "Pati"
      },
      {
        "id": 27,
        "name": "Lamhong",
        "address": "Jember"
      },
      {
        "id": 28,
        "name": "Gembolo Jaya",
        "address": "Jajag"
      },
      {
        "id": 29,
        "name": "Ho Tiong",
        "address": "Parijatah"
      },
      {
        "id": 30,
        "name": "Insakas",
        "address": "Malang"
      },
      {
        "id": 31,
        "name": "Junaidi",
        "address": "Makassar"
      },
      {
        "id": 32,
        "name": "Melisa",
        "address": "Sragen"
      },
      {
        "id": 33,
        "name": "Moh Ashadi",
        "address": "Kebumen"
      },
      {
        "id": 34,
        "name": "Nahuri",
        "address": "Songgon"
      },
      {
        "id": 35,
        "name": "Padi Sejati",
        "address": "Parijatah"
      },
      {
        "id": 36,
        "name": "Puspa",
        "address": "Bali"
      },
      {
        "id": 37,
        "name": "Rian",
        "address": "Ngawi"
      },
      {
        "id": 38,
        "name": "Rika",
        "address": "Taman Agung"
      },
      {
        "id": 39,
        "name": "Sinar Abadi",
        "address": "Pari Jatah"
      },
      {
        "id": 40,
        "name": "Sukma Bulog",
        "address": "Banyuwangi"
      },
      {
        "id": 41,
        "name": "Adi Sumber Baru",
        "address": "Pasuruan"
      },
      {
        "id": 42,
        "name": "Adi Sumber Baru",
        "address": "Pasuruan"
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Suppliers', null, {});
  }
};
