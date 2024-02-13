import { useState } from "react"
import Productcard from "../components/Product-card";


function Search() {
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("");
  const [maxPrice,setMaxPrice]=useState(100000);
  const [category,setCategory]=useState("");
  const [page,setPage]=useState(1);
  

const addToCartHandler=()=>{};

const isPrevPage=page >1;
const isNextPage=page<4;


  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e)=>setSort(e.target.value)}>
             <option value="">None</option>
             <option value="asc">Price (Low to High)</option>
             <option value="dsc">Price (High to Low)</option>
              
          </select>
        </div>
        <div>
          <h4>Max Price:{maxPrice || ""}</h4>
            <input type="range"
             min={100}
             max={100000}
             value={maxPrice}
             onChange={(e)=>setMaxPrice(Number(e.target.value))}
            />
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e)=>setCategory(e.target.value)}>
             <option value="">All</option>
             <option value="">Sample1</option>
             <option value="">Sample2</option>

          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="search by name"
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        />
           <div className="search-product-list">
             <Productcard
               productId='adasds'
               name='Macbook'
               price={3434}
               stock={436}
               handler={addToCartHandler}
               photo='https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202310?wid=600&hei=500&fmt=p-jpg&qlt=95&.v=1699558878477'
             />
           </div>
           <article>
            <button disabled={!isPrevPage} onClick={()=>setPage((prev)=>prev-1)}>prev</button>
            <span>{page} of {4}</span>
            <button disabled={!isNextPage} onClick={()=>setPage((prev)=>prev+1)}>Next</button>

           </article>

      </main>
    </div>
  )
}

export default Search
