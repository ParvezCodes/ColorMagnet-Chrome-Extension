const colorPickerBtn = document.querySelector("#color__picker");
const colorList = document.querySelector(".all__colors");
const clearAll = document.querySelector(".clear__all");

// Get previously picked colors from localStorage
// or start with an empty list if there are no saved colors.
const pickedColors = JSON.parse(localStorage.getItem("picked-color") || "[]");

const copyColor = (element) => {
  // Use the Clipboard API to write the color value (from the dataset) to the clipboard
  navigator.clipboard.writeText(element.dataset.color);

  element.innerHTML = "Copied";
  setTimeout(() => (element.innerText = element.dataset.color), 1000);
};

const showColors = () => {
  if (!pickedColors.length) return;

  //   generating list for pickedColors and add it to colorList
  colorList.innerHTML = pickedColors
    .map(
      (color) =>
        `<li class="color">
            <span class="rect" style="background : ${color}; border : 1px solid ${
          color === "#ffffff" ? "#ccc" : color
        }"></span>  
            <span class="value" data-color="${color}">${color}</span>
        </li>`
      //The data-color attribute is used to store additional information (color)
    )
    .join(""); // Join the list items into a single string

  document.querySelector(".picked__color").classList.remove("hide");

  // Add click event listeners to all elements with the class "color"
  document.querySelectorAll(".color").forEach((li) => {
    // The click event triggers the copyColor function with the lastElementChild as an argument mins second sapn (color value)
    li.addEventListener("click", (e) =>
      copyColor(e.currentTarget.lastElementChild)
    );
  });
};

showColors();

const activateEyeDropper = () => {
  // wheb colorpicker is active hide our wrapper container from display
  document.body.style.display = "none";
  setTimeout(async () => {
    try {
      // Create a new instance of the EyeDropper class
      const eyeDropper = new EyeDropper();

      // Open the eye dropper and get the picked color in sRGBHex format
      const { sRGBHex } = await eyeDropper.open();
      navigator.clipboard.writeText(sRGBHex);

      // Check if the picked color is not already in the array to avoid duplicates
      if (!pickedColors.includes(sRGBHex)) {
        // Store the picked color in the array for localstorage
        pickedColors.push(sRGBHex);

        // Save the array of pickedColors to the localStorage after converting it to a JSON string & 1st Arg(name) 2nd Arg(value) for localstorage
        localStorage.setItem("picked-color", JSON.stringify(pickedColors));

        // show all colors in picked color section
        showColors();
      }
    } catch (error) {
      console.log("Faild to copy color code !");
    }
    document.body.style.display = "block";
  }, 10);
};

// make array length is 0 and update array
const clearAllColors = () => {
  pickedColors.length = 0;
  localStorage.setItem("picked-color", JSON.stringify(pickedColors));

  //   if array is empty then hide picked color elements
  document.querySelector(".picked__color").classList.add("hide");
};

clearAll.addEventListener("click", clearAllColors);
colorPickerBtn.addEventListener("click", activateEyeDropper);
