// variable declarations

const wishBtn = document.querySelector(".cart-btn");
const closeWishBtn = document.querySelector(".close-cart");
const clearWishBtn = document.querySelector("clear-cart");
const wishDOM = document.querySelector(".cart");
const wishOverlay = document.querySelector(".cart-overlay");
const wishItems = document.querySelector(".cart-items");
// const wishTotal= document.querySelector(".cart-total")
const wishContent = document.querySelector(".cart-content");
const donationsDOM = document.querySelector(".donations-center");

// const btns = document.querySelectorAll(".bag-btn");
// console.log(btns);

// creating the main wish list
let wishList = [];

// creating the buttonsDOM array
let buttonsDOM = [];

// getting the donations from the .json file
class Donations {
  async getDonations() {
    try {
      let result = await fetch("/donations.json");
      // getting our data in json file
      let data = await result.json();
      let donations = data.items;

      // organizing the json file objects as shown below into 3 sectors
      donations = donations.map((item) => {
        const { title } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return {
          title,
          id,
          image,
        };
      });
      return donations;
    } catch (error) {
      console.log(error);
    }
  }
}

// this class is responsible for getting all the donations from the donation list and displaying them
class UI {
  displayDonations(donations) {
    console.log(donations);
    let result = "";
    donations.forEach((donation) => {
      result += `
           <!-- single donation -->
                <article class="donation">
                    <div class="img-container">
                        <img src="${donation.image}" alt="salad_donation" class="donation-img">
                        <button class="bag-btn" data-id="${donation.id}">

                            <i class="fas fa-hand-holding-heart fa-3x " id="nex"></i>
                            Add to Wish List
                        </button>

                    </div>
                    <h3>${donation.title}</h3>
                    <h4></h4>
                </article>
                <!-- end of Single Donation -->
          `;
    });
    donationsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // checking what items is already in our wishList
      let inWishList = wishList.find((item) => item.id === id);
      if (inWishList) {
        button.innerText = "Already in Request List";
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        // console.log(event);
        event.target.innerText = "In Request List";
        event.target.disabled = true;

        //   getting each item from the wish List
        let wishItem = { ...Storage.getDonation(id), amount: 1 };
        // adding items to the wishlist
        wishList = [...wishList, wishItem];

        // saving the cart in local storage
        Storage.saveWishList(wishList);


        // setting the wishList values
        this.setWishListValues(wishList);
        // displaying the wish list items
        this.addWishListItem(wishItem);
        // showing the wish list
      });
    });
  }

  setWishListValues(wishList)
  {
      let tempTotal= 0;
      let itemsTotal=0;
      wishList.map(item =>{
          itemsTotal+=item.amount;
      })
      wishItems.innerText=itemsTotal;
    
  }
  addWishListItem(item){
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
      <img src=${item.image}>
      <div>
          <h4>${item.title}</h4>
          <!-- <h5>4 OneHearts</h5> -->
          <span class="remove-item" data-id= ${item.id}>Remove</span>
      </div>
      <div>
          <i class="fas fa-chevron-up" data-id= ${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id= ${item.id}></i>
      </div>`
      wishContent.appendChild(div);
      console.log(wishContent);
  }
  
}

// local storage class
class Storage {
  static saveDonations(donations) {
    localStorage.setItem("donations", JSON.stringify(donations));
  }

  static getDonation(id) {
    let donations = JSON.parse(localStorage.getItem("donations"));
    return donations.find((donation) => donation.id === id);
  }

  static saveWishList(wishList)
  {
      localStorage.setItem("wishList",JSON.stringify(wishList))
  }
}

// responsible for running our classes
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const donations = new Donations();

  // getting all donations
  donations
    .getDonations()
    .then((donations) => {
      ui.displayDonations(donations);
      Storage.saveDonations(donations);
    })
    .then(() => {
      //   ui.getDonations;
      ui.getBagButtons();
    });
});
