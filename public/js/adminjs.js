const deleteProduct = (btn) => {
    const productID = btn.parentNode.querySelector("[name='productID']").value;
    const csrf = btn.parentNode.querySelector("[name='_csrf']").value;
    const productElement = btn.closest("article");

    // sending delete request
    fetch('/admin/product/' + productID, {
        method: 'DELETE',
        header: {
            'csrf-tokken': csrf
        }
    })
        .then(result => {
            console.log("result = ", result);
            return result.json();
        })
        .then(data => {
            console.log("data = ", data);
            if (data.status == 200) {
                productElement.parentNode.removeChild(productElement); // alternative is below
                // productElement.remove(); // but this is only supported in new browsers
            }
            alert(data.message);
        })
        .catch(err => {
            console.log("Error while deleting product == err = ", err);
            alert("Error while deleting product.");
        })
}