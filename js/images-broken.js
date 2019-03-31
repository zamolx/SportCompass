function brokenImage(image) {
    image.onerror = "";
    image.src = "img/not-available2.jpg";
    return true;
}