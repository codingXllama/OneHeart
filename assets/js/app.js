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

const btns = document.querySelectorAll(".bag-btn");
// console.log(btns);

// creating the main wish list
let wishList = [];

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
    buttons.forEach((button) => {
      let id = button.dataset.id;
    //   console.log(id);

    // checking what items is already in our wishList
    let inWishList= wishList.find(item=>item.id ===id);
    if (inWishList){
        button.innerText="Already in Request List";
        button.disabled=true;
    }
    // if the button is not in the cart
    else{
        button.addEventListener('click',(event)=>{
            // console.log(event);
            event.target.innerText="In Request List";
            event.target.disabled=true;
            // getting the item we just selected from the storage 
        })
    }
    });
  }
}

// local storage class
class Storage {
  static saveDonations(donations) {
    localStorage.setItem("donations", JSON.stringify(donations));
  }
}

// responsible for running our classes
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const donations = new Donations();

  // getting all donations
  donations.getDonations()
    .then((donations) => {
      ui.displayDonations(donations);
      Storage.saveDonations(donations);
    })
    .then(() => {
    //   ui.getDonations;
      ui.getBagButtons();
    });
});
