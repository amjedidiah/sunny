const makeCardPulse = (input) => {
  makeCardNormal(input);
  input.parentElement.parentElement.parentElement.classList.add("active");
};

const makeCardNormal = () => $(".card").removeClass("active");

const submitForm = (form) => {
  console.log(form);
};

document
  .querySelector("form#inputForm")
  .addEventListener(
    "submit",
    (e) => (e.preventDefault(), submitForm(e.target))
  );

// Disable console logging
console.log = function () {};
console.info = function () {};
