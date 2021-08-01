import axios from "axios";
import { countries } from "./countries";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
const displayBlock = () => {
  if (
    document.querySelector(".total-container") ||
    document.querySelector(".purchase-container") ||
    document.querySelector(".clear-btn")
  ) {
    document.querySelector(".total-container").style.opacity = "1";
    document.querySelector(".clear-btn").style.opacity = "1";
    document.querySelector(".purchase-container").style.opacity = " 1";
  }
};
const displayNone = () => {
  if (document.querySelector(".total-container")) {
    document.querySelector(".total-container").style.opacity = "0";
    document.querySelector(".purchase-container").style.opacity = "0";
    document.querySelector(".clear-btn").style.opacity = " 0";
  }
};
const err = document.querySelector(".err");
const errorModal = document.querySelector(".error-modal");
const clearFieldsData = () => {
  let username = document.getElementById("username");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");
  if (username || email || password || confirmPassword) {
    document.getElementById("username").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
  }
};
const message = (action, msg, time) => {
  err.textContent = msg;
  err.classList.add(action);
  errorModal.classList.add("display-modal");
  setTimeout(() => {
    err.classList.remove(action);
    errorModal.classList.remove("display-modal");
  }, time);
  return;
};
// signIN
const signUp = async (username, email, password, confirmPassword) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/signUp`,
      data: {
        username,
        email,
        password,
        confirmPassword,
      },
    });
    setTimeout(() => {
      location.assign("/furnitures/login");
    }, 1500);
    message("green", res.data.message, 5000);
  } catch (err) {
    message("red", err.response.data.message, 3000);
  }
};

const signUpForm = document.querySelector(".signUp-form");
if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    await signUp(username, email, password, confirmPassword);
  });
}
// LOGIN
const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/login`,
      data: {
        email,
        password,
      },
    });
    message("green", res.data.message, 5000);
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    setTimeout(() => {
      location.assign("/furnitures/All");
    }, 1500);
  } catch (err) {
    if (err.status === 400) {
      return message("red", "Entere required information", 3000);
    } else {
      message("red", err.response.data.message, 3000);
    }
  }
};
const loginForm = document.querySelector(".login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    if (!email || !password) {
      return message("red", "Cannot be empty", 3000);
    } else {
      await login(email, password);
    }
  });
}
// NAV
const overlay = document.querySelector(".overlay");
const bars = document.querySelector(".fa.fa-bars");
const navs = document.querySelector(".navs");
if (bars) {
  bars.addEventListener("click", () => {
    navs.classList.add("show-nav");
    navs.classList.add("overlay");
  });
}

// TIMES BUTTON TO REMOVE NAV
const times = document.querySelector(".times");
if (times) {
  times.addEventListener("click", () => {
    navs.classList.remove("show-nav");
    navs.classList.remove("overlay");
  });
}

// LOGOUT
const logoutUser = async () => {
  await axios(
    `${window.location.protocol}//${window.location.hostname}:${window.location.port}/logout`
  );
  window.location.assign("/furnitures");
};
const logout = document.querySelector(".logout");

if (logout) {
  logout.addEventListener("click", () => {
    logoutUser();
  });
}

// Account form update
const updateMe = async (data) => {
  const img = document.querySelector(".uploaded-account");
  try {
    const res = await axios({
      method: "PATCH",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/User/updateMe`,
      data,
    });
    setTimeout(() => {
      if (res.data.body.image) {
        img.src = `/IMG/${res.data.body.image}`;
      }
    }, 1500);
  } catch (err) {
    return err;
  }
};
const updateBtn = document.querySelector(".account-form");

if (updateBtn) {
  updateBtn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username", document.getElementById("username").value);
    form.append("email", document.getElementById("email").value);
    form.append("image", document.getElementById("image").files[0]);
    await updateMe(form);
  });
}
// CHANGE PASSWORD
const changePasswordMessage = document.querySelector(
  ".change-password-message"
);
const changePassword = async (oldPassword, password, confirmPassword) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/User/changePassword`,
      data: {
        oldPassword,
        password,
        confirmPassword,
      },
    });
    resetMsg(changePasswordMessage, res.data.message);
    clearChangePasswordFields();
  } catch (err) {
    resetMsg(changePasswordMessage, err.response.data.message);
  }
};
const passwordForm = document.querySelector(".password-form");

const clearChangePasswordFields = () => {
  document.getElementById("oldPassword").value = "";
  document.getElementById("newPassword").value = "";
  document.getElementById("changePwdConfirm").value = "";
};
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const changePwdConfirm = document.getElementById("changePwdConfirm").value;
    await changePassword(oldPassword, newPassword, changePwdConfirm);
  });
}
// BBOKINGS UI ELEMENTS
const bookingContainer = document.querySelector(".booking");
const mapBookings = (userProducts) => {
  const products = userProducts
    .map((product) => {
      const { name, price_total, quantity, image, id } = product;
      return `
<div class="booking-img-container">
  <img src="${image}" class="booking-img" alt="${name}"/>
  <div class="overlay-booking">
   <div class="overlay-items">
    <p class="name">${name}</p>
    <p class="total_price">TotalPrice:${price_total}</p>
    <p class="quantity">Quantity:${quantity}</p>
    <div class="review-container-btn">
     <button type="button" class="write-review" data-rev="${id}">Write Review</button>
    </div>
   </div>
  </div>
</div>`;
    })
    .join(" ");
  bookingContainer.innerHTML = products;
};
// FLATTENED
const flattenedArray = (arr) => {
  let userFreshArray = [];
  arr.forEach((element) => {
    if (Array.isArray(element)) {
      userFreshArray = userFreshArray.concat(element);
    } else {
      userFreshArray.push(element);
    }
  });
  return userFreshArray;
};
const booking = async () => {
  try {
    const res = await axios(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/bookings`
    );
    const userProducts = [...res.data.userProducts];
    const products = userProducts.map((el, index) => {
      // ARRAY OF PRODUCTS COMING FROM CURRENT USER
      const newArray = [...el.userProducts];
      return newArray;
    });
    // FLATTEN ARRAY TO BE IN OBJECTS

    const flatten = flattenedArray(products);
    if (flatten.length <= 0) {
      const div = document.createElement("div");
      div.classList.add("no-booking");
      div.innerHTML = "Your Have No Bookings";
      return (bookingContainer.innerHTML = div.textContent);
    } else {
      mapBookings(flatten);
    }
  } catch (err) {
    return err;
  }
};
// GET REVIEW
const mapReview = (arr) => {
  const reviews = arr.map((rev) => {
    const {
      createdAt,
      rating,
      product: { image, name },
      review,
      id,
    } = rev;
    return {
      createdAt,
      rating,
      image,
      name,
      review,
      id,
    };
  });
  return reviews;
};

// MAP USER REVIEW INTO UI
const reviewsContainer = document.querySelector(".reviewMainContainer ");

const mapUserUI = (userReview) => {
  const reviews = userReview
    .map((el) => {
      const { createdAt, rating, image, name, review, id } = el;
      return `
  <div class="review">
   <div class="img-container">
   <img src="${image}" class="review-img"  alt="${name}"/>
   <span>${createdAt.slice(0, 16).replace("T", " ")}</span>
  </div>
  <div class="stars">
    <i class="fa fa-star star">${rating}/5 stars</i>
  </div>
  <div class="user-review">
   <p>${review[0]}</p>
  <button type="button" class="remove-review" data-delete=${id}>delete review</button>
  </div>
</div>
  `;
    })
    .join(" ");
  reviewsContainer.innerHTML = reviews;
};

const getReview = async () => {
  try {
    const res = await axios(
      `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/furniture/reviews`
    );
    const mapped = mapReview(res.data.review);
    if (mapped.length <= 0) {
      const div = document.createElement("div");
      div.classList.add("no-review");
      div.innerHTML = "Your Have No Reviews";
      return (reviewsContainer.innerHTML = div.textContent);
    } else {
      mapUserUI(mapped);
    }
    // GET Reviews into An Array
  } catch (err) {
    return err;
  }
};
// WRITE REVIEWS
// KEEPS PARAMS OR ID NEED FOR BACKEND
let productId = "";
// USER rating
let rating = null;

// REMOVES STARS AFTER USER SUBMITS
const removeStars = (stars) => {
  stars.forEach((removeStarClasses) => {
    removeStarClasses.classList.remove("review-color");
  });
};
const reviewFormContainer = document.querySelector(".review-form-container");
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("write-review")) {
    reviewFormContainer.classList.add("show-review");
    document.body.classList.add("overlay-review");
    const id = e.target.dataset.rev;
    productId = id;
  }
});
// CLOSE REVIEW
const stars = document.querySelectorAll(".star");
const closeReview = document.querySelector(".close-review");
if (closeReview) {
  closeReview.addEventListener("click", () => {
    reviewFormContainer.classList.remove("show-review");
    document.body.classList.remove("overlay-review");
    removeStars(stars);
  });
}
// REVIEWS STARS

if (stars.length > 0) {
  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      removeStars(stars);
      stars.forEach((newStar, newIndex) => {
        if (index >= newIndex) {
          newStar.classList.add("review-color");
          rating = index + 1;
        }
      });
    });
  });
}
const reviewForm = document.querySelector(".review-form");
const reviewError = document.querySelector(".show-booking-error");
const userReviewError = document.querySelector(".user-error");
const userReview = async (id, rating, review) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/furniture/${id}/review`,
      data: {
        rating,
        review,
      },
    });
    // REMOVE RATING AFTER SUBMISSION
    removeStars(stars);
    // IF SUCCESFULLY SUBMITTED CLOSE THE MODAL FOR WRITING REVIEW
    reviewFormContainer.classList.remove("show-review");
    // Make textarea empty when successful
    userReviewError.classList.add("success");
    userReviewError.value = res.data.message;
    setTimeout(() => {
      userReviewError.classList.remove("success");
      userReviewError.value = res.data.message;
    }, 3000);
    document.querySelector(".user-review").value = " ";
    document.body.classList.remove("overlay-review");
  } catch (err) {
    userReviewError.classList.add("fail");
    userReviewError.value = err.response.data.message;
    setTimeout(() => {
      userReviewError.classList.remove("fail");
      userReviewError.value = err.response.data.message;
    }, 3000);

    // reviewError.innerHTML = err.response.data.message;
    document.querySelector(".user-review").value = " ";
    removeStars(stars);
  }
};
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    const review = document.querySelector(".user-review").value;
    e.preventDefault();
    await userReview(productId, rating, review);
  });
}
// GET BOOKINGS AND REVIEWS WHEN PAGE LOADS
window.addEventListener("DOMContentLoaded", () => {
  getReview();
  booking();
});
// USER DELETE REVIEWS
async function removeReview(id) {
  try {
    const res = await axios({
      method: "DELETE",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/furniture/reviews/${id}`,
    });
    getReview();
  } catch (err) {
    return err;
  }
}
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-review")) {
    const id = e.target.getAttribute("data-delete");
    removeReview(id);
  }
});

// NAVS LINKS
const navsLinks = document.querySelectorAll(".navs-links");
if (navsLinks.length > 0) {
  for (let i = 0; i <= navsLinks.length; i++) {
    if (navsLinks[i]) {
      navsLinks[i].addEventListener("click", () => {
        navs.classList.remove("overlay");
        navs.classList.remove("show-nav");
      });
    }
  }
}

// CART
const cartItemCount = document.querySelector(".cart-items");
const cartItems = document.querySelector(".nav-cart");
const sideNav = document.querySelector(".sidenav");
const closeCart = document.querySelector(".close-cart");
if (cartItems) {
  cartItems.addEventListener("click", () => {
    sideNav.classList.add("display");
  });
}
if (closeCart) {
  closeCart.addEventListener("click", () => {
    sideNav.classList.remove("display");
  });
}

// getStorage
function getStorage(name) {
  let products = localStorage.getItem(name);
  if (products) {
    return JSON.parse(products);
  }
}
const cartContainer = document.querySelector(".cart-container");
const addToCartBtns = document.querySelectorAll(".add-to-cart");
// ADD TO SIDE CART_ITEMS
let products = [];
if (addToCartBtns) {
  addToCartBtns.forEach((el) => {
    el.addEventListener("click", (e) => {
      // PURCHASE BTN AND TOTAL container
      displayBlock();
      const productsContainer = e.currentTarget.parentElement;
      const img = productsContainer.children[0].firstElementChild.src;
      const name = productsContainer.children[1].firstElementChild.innerHTML;
      const price = productsContainer.children[1].children[1].innerHTML;
      const id = productsContainer.children[2].firstElementChild.dataset.single;
      // CHECKS IF ITEM EXIST IN THE STORAGE
      let product = "";
      if (getStorage("userProducts")) {
        product = getStorage("userProducts").find(
          (product) => product.id === id
        );
      }
      let newProduct = { id, name, price, img, count: 1 };
      if (!product) {
        // adds Object to the last element of an array
        products[products.length] = newProduct;
      } else {
        products = products.map((el) => {
          if (el.id === id) {
            const newProduct = { ...el, count: el.count + 1 };
            return newProduct;
          }
          return el;
        });
      }

      // CALCULATE NUMBER OF ITEMS IN CART_ITEMS
      itemsCount(products);
      // displayProducts
      displaySideCart(products);
      localStorage.setItem("userProducts", JSON.stringify(products));
      // OPEN SIDECART
      sideNav.classList.add("display");
    });
  });
}
// ICREASE AMOUNT
document.body.addEventListener("click", (e) => {
  const chevronUp = e.target.classList.contains("fa-chevron-up");
  if (chevronUp) {
    const element = e.target.parentElement.children[1];
    const id = e.target.getAttribute("data-cart");
    products = products.map((product) => {
      if (product.id === id) {
        const newObject = { ...product, count: (product.count += 1) };
        element.textContent = product.count;
        return newObject;
      }
      return product;
    });

    // CALCULATE NUMBER OF ITEMS IN CART_ITEMS
    itemsCount(products);
    localStorage.setItem("userProducts", JSON.stringify(products));
  }
});
// DECREASE AMOUNT
document.body.addEventListener("click", (e) => {
  const chevronDown = e.target.classList.contains("fa-chevron-down");
  if (chevronDown) {
    const element = e.target.parentElement.children[1];
    const id = e.target.getAttribute("data-cart");
    const child = e.target.parentElement.parentElement;
    const parent = e.target.parentElement.parentElement.parentElement;
    products = products
      .map((product) => {
        if (product.id === id) {
          const newObject = { ...product, count: (product.count -= 1) };
          if (product.count <= 0) {
            parent.removeChild(child);
          }
          element.textContent = product.count;
          return newObject;
        }
        return product;
      })
      .filter((el) => el.count !== 0);

    // CALCULATE NUMBER OF ITEMS IN CART_ITEMS
    itemsCount(products);
    localStorage.setItem("userProducts", JSON.stringify(products));
    if (products.length <= 0) {
      displayNone();
    }
  }
});
// REMOVE FROM CART
document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const id = e.target.dataset.removeId;
    products = products.filter((product) => product.id !== id);
    displaySideCart(products);
    // CALCULATE NUMBER OF ITEMS IN CART_ITEMS
    itemsCount(products);
    localStorage.setItem("userProducts", JSON.stringify(products));
    if (products.length <= 0) {
      displayNone();
    }
  }
});
// CLEAR CART
function clearCart() {
  products = [];
  let cartContainer = document.querySelector(".cart-container");
  let children = [...cartContainer.children];
  children.forEach((child) => {
    cartContainer.removeChild(child);
  });
  localStorage.setItem("userProducts", products);
  itemsCount(products);
}
const clearBtn = document.querySelector(".clear-btn");
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    clearCart();
    displayNone();
  });
}

function itemsCount(products) {
  const cartItemCount = document.querySelector(".cart-items");
  const amount = document.querySelector(".total-price");
  let { total, count } = products.reduce(
    (total, current) => {
      total.count += current.count;
      total.total += current.price * 1 * current.count;
      return total;
    },
    {
      total: 0,
      count: 0,
    }
  );
  // THERES error when user is not loggen in thats this code is here since the elements dont exist
  if (!cartItemCount || !amount) return;
  cartItemCount.textContent = count;
  amount.textContent = `$${total.toFixed(2)}`;
}
function displaySideCart(products) {
  const cartContainer = document.querySelector(".cart-container");
  let newProducts = products
    .map((product) => {
      const { name, img, id, count, price } = product;
      return `<div class="cart-product">
        <div class="cart-img-container">
           <img src=${img} class="cart-img" alt=${name}/>
        </div>
        <div class="cart-info">
          <p class="name">${name}</p>
          <p class="price">${price}</p>
          <button type="button" class="remove-btn" data-remove-id=${id}>remove</button>
        </div>
       <div class="chevrons">
         <i class="fa fa-chevron-up chev" data-cart=${id}></i>
         <div>${count}</div>
         <i class="fa fa-chevron-down chev" data-cart=${id}></i>
       </div>
     </div>
       `;
    })
    .join(" ");
  if (cartContainer) cartContainer.innerHTML = newProducts;
}
// FORGOT  PASSWORD
const resetMessage = document.querySelector(".reset-message");
// resetMessageFunction
function resetMsg(resetMessage, msg) {
  resetMessage.innerHTML = msg;
  setTimeout(() => {
    resetMessage.innerHTML = "";
  }, 3000);
  return msg;
}
const forgot = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/User/Forgot`,
      data: {
        email,
      },
    });

    resetMsg(resetMessage, res.data.message);
    setTimeout(() => {
      window.location.assign("/furnitures");
    }, 1500);
  } catch (err) {
    resetMsg(resetMessage, err.response.data.message);
  }
};
const forgotForm = document.querySelector(".forgot-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    if (!email) {
      return resetMsg(resetMessage, "field cannot be empty");
    } else {
      await forgot(email);
    }
  });
}
// RESET PASSWORD
const reset = async (password, confirmPassword) => {
  try {
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.hostname}:${
        window.location.port
      }/furnitures/User/Reset/resetToken?token=${window.location.search.slice(
        7
      )}`,
      data: {
        password,
        confirmPassword,
      },
    });
    resetMsg(resetMessage, res.data.message);
    window.location.assign("/furnitures");
  } catch (err) {
    resetMsg(resetMessage, err.response.data.message);
  }
};
const resetForm = document.querySelector(".reset-form");
if (resetForm) {
  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (!password || !confirmPassword) {
      return resetMsg(resetMessage, "fields cannot be empty");
    } else {
      await reset(password, confirmPassword);
    }
  });
}
// POST REQUEST WITH ITEMS
if (document.URL.endsWith("/furnitures/All")) {
  const stripe = Stripe(
    "pk_test_51JFK4NCZg3yTxOGJAVAEWW4mBaS6OeoKtUMg9mkLUIqc4EGFSp9JfMV7UUcf1zwBC8PLUfFPsYVoPFaalqVjkJG300uh5zDVwN"
  );

  const createBooking = async (data) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/bookings`,
        data,
      });
      stripe.redirectToCheckout({
        sessionId: res.data.session.id,
      });
    } catch (err) {
      return err;
    }
  };
  const purchaseBtn = document.querySelector(".purchase-btn");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await createBooking(getStorage("userProducts"));
      e.target.innerHTML = "Processing....";
      localStorage.removeItem("userProducts");
      setTimeout(() => {
        displayNone();
      }, 5000);
    });
  }
}
// CONTACT US PAGE
const contactUsForm = document.querySelector(".contact-us-form");
if (contactUsForm) {
  const selectId = document.querySelector("#countries");
  let mapCountries = countries
    .map((country) => {
      return `<option value=${country.name}>${country.name}</option>`;
    })
    .join(" ");
  selectId.innerHTML = mapCountries;
  const contactFormMessage = document.querySelector(".contact-form-message p");
  const contactFormMessageContainer = document.querySelector(
    ".contact-form-message"
  );

  const contactFormMessageFunc = (msg) => {
    contactFormMessage.innerHTML = msg;
    contactFormMessageContainer.classList.add("show-contact-message");
    setTimeout(() => {
      contactFormMessage.innerHTML = "";
      contactFormMessageContainer.classList.remove("show-contact-message");
    }, 3000);
    return msg;
  };

  const clearContactUs = () => {
    setTimeout(() => {
      document.getElementById("contact-name").value = "";
      document.getElementById("contact-email").value = "";
      document.getElementById("contact-category").value = "";
      document.getElementById("contact-text").value = "";
      document.querySelector("#countries").value = "";
    }, 3000);
  };
  const contactUs = async (name, email, category, country, message) => {
    try {
      const res = await axios({
        method: "POST",
        url: `${window.location.protocol}//${window.location.hostname}:${window.location.port}/furnitures/ContactUs`,
        data: {
          name,
          email,
          category,
          country,
          message,
        },
      });

      contactFormMessageFunc(res.data.message);
      clearContactUs();
    } catch (err) {
      contactFormMessageFunc(err.response.data.message);
    }
  };

  contactUsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const contactName = document.getElementById("contact-name").value;
    const contactEmail = document.getElementById("contact-email").value;
    const contactCategory = document.getElementById("contact-category").value;
    const contactText = document.getElementById("contact-text").value;
    const country = document.querySelector("#countries").value;
    await contactUs(
      contactName,
      contactEmail,
      contactCategory,
      country,
      contactText
    );
  });
}

// GET INFORMATION IN STORAGE WHEN WINDOW LOADS
window.addEventListener("DOMContentLoaded", () => {
  if (!getStorage("userProducts") || products.length === 0) {
    return displayNone();
  }
  products = getStorage("userProducts");
  displaySideCart(getStorage("userProducts"));
  itemsCount(getStorage("userProducts"));
});
// MAPBOX

if (document.URL.endsWith("AboutUs")) {
  const routes = [
    [21.01178, 52.22977],
    [19.47395, 51.77058],
    [22.568445, 51.25],
  ];
  const cities = ["warsaw", "Lodz", "Lublin"];
  mapboxgl.accessToken =
    "pk.eyJ1IjoibGliZXJ0eS1kYW5pZWwxODI1IiwiYSI6ImNrcmkweDB1dDBpa2kzMW81NWZnMmdvaXEifQ.h4RY23LB-coocjdWS07Wbg";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    //   center: [22.5667, 51.25],
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  routes.forEach((el, index) => {
    const img = document.createElement("img");
    img.classList.add("marker");
    img.src = "/IMG/marker (2).jpg";
    new mapboxgl.Marker({
      element: img,
      anchor: "bottom",
    })
      .setLngLat(el)
      .addTo(map);
    bounds.extend(el);
    new mapboxgl.Popup()
      .setLngLat(el)
      .setHTML(`<h1 class="outstanding">In ${cities[index]}<h1>`)
      .addTo(map);
  });
  map.fitBounds(bounds);
}
