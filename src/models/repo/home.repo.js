class QueryProduct {
  products = [];
  query = {};
  constructor(products, query) {
    this.products = products;
    this.query = query;
  }
  categoriesQuery = () => {
    this.products = this.query.category
      ? this.products.filter((c) => c.category == this.query.category)
      : this.products;
    return this;
  };
  ratingQuery = () => {
    this.products = this.query.rating
      ? this.products.filter(
          (c) =>
            parseInt(this.query.rating) <= c.rating &&
            c.rating < parseInt(this.query.rating) + 1
        )
      : this.products;
    return this;
  };

  searchQuery = () => {
    this.products = this.query.searchValue
      ? this.products.filter(
          (p) =>
            p.name.toUpperCase().indexOf(this.query.searchValue.toUpperCase()) >
            -1
        )
      : this.products;
    return this;
  };
  priceQuery = () => {
    this.products = this.products.filter(
      (p) =>
        (parseInt(p.price) >= parseInt(this.query.lowPrice)) &
        (parseInt(p.price) <= parseInt(this.query.highPrice))
    );
    console.log(this.products);
    return this;
  };
  sortByPrice = () => {
    if (this.query.sortPrice) {
      if (this.query.sortPrice === "low-to-high") {
        this.products = this.products.sort(function (a, b) {
          return a.price - b.price;
        });
      } else {
        this.products = this.products.sort(function (a, b) {
          return b.price - a.price;
        });
      }
    }
    return this;
  };
  skip = () => {
    let { pageNumber } = this.query;
    if (pageNumber === 1) {
      return this;
    }
    const skipPage = (parseInt(pageNumber) - 1) * this.query.parPage;
    let skipProduct = [];
    console.log(pageNumber, skipPage);
    console.log(this.products);
    for (let i = skipPage; i < this.products.length; i++) {
      skipProduct.push(this.products[i]);
    }
    this.products = skipProduct;
    return this;
  };

  limit = () => {
    let temp = [];
    if (this.products.length > this.query.parPage) {
      for (let i = 0; i < this.query.parPage; i++) {
        temp.push(this.products[i]);
      }
    } else {
      temp = this.products;
    }
    this.products = temp;
    return this;
  };

  getProducts = () => {
    console.log(this.products);
    return this.products;
  };

  countProducts = () => {
    return this.products.length;
  };
}

module.exports = QueryProduct;
