var coll = document.getElementsByClassName("collapsible");

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      content.style.opacity = 0;
    } else {
      content.style.display = "block";
      content.style.opacity = 1;
    }
  });
}

//add confirm for delete action
const forms = document.forms
for (let element of forms) {
  element.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete')) {
      if (!confirm("確定要刪除這筆資料嗎?")) {
        e.preventDefault()
        e.target.blur()
      }
    }
  })
}