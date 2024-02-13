
import { Link } from 'react-router-dom'
import Productcard from '../components/Product-card'

function Home() {
  const addToCartHandler=()=>{}
  return (
     <div className='home'>
      <section>

      </section>
      <h1>
        Latest products
        <Link to="/search" className='findmore'>More</Link>
      </h1>

      <main>
        <Productcard
         productId='adasds'
         name='Macbook'
         price={3434}
         stock={436}
         handler={addToCartHandler}
         photo='https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202310?wid=600&hei=500&fmt=p-jpg&qlt=95&.v=1699558878477'
        />

      </main>

     </div>
  )
}

export default Home
