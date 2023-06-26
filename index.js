const productsList = document.querySelector('#products-list')

// GETTING THE PRODUCTS LIST
fetch('http://localhost:8080/api/products')
    .then(response => response.json())
    .then(data => {
        const productsHtml = data.map(product => 
            `<li>${product.name} - ${product.brand} - ${product.price}</li>`
        ).join('')

        console.log(productsHtml)

        productsList.innerHTML = productsHtml

        /* data.forEach(product => {
            const productsHtml = `<li>${product.name} - ${product.brand} - ${product.price}</li>`
            
            productsList.innerHTML += productsHtml
        }) */
    })