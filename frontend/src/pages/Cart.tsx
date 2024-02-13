import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/cartItems";
import { Link } from "react-router-dom";

const cartItems = [
{
 productId:"sdfsfas",
 photo:'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mac-card-40-macbookpro-14-16-202310?wid=600&hei=500&fmt=p-jpg&qlt=95&.v=1699558878477',
 
 name:"macbook",
 price:3000,
 quantity:4,
 stock:10,


},



];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shippingCharges = 200;
const total = subtotal + tax + shippingCharges;
const discount = 400;

function Cart() {
  const [couponCode, setCouponCode] = useState("");
  const [isValidCouponCode, setIsValidCouponCode] = useState(false);
      

  useEffect(
  ()=>{
    const timeOutid=setTimeout(()=>{
       if(Math.random()>0.5){
        setIsValidCouponCode(true);
        
       }else{
        setIsValidCouponCode(false)
       }
    },100);
    return ()=>{
      clearTimeout(timeOutid)
    };
  },[couponCode]
  )
  return (
    <div className="cart">
      <main>
       {
        cartItems.length>0 ? cartItems.map((i,index)=> (<CartItems key={index} cartItem={i}/>
        
        )
       ):(
        <h1>No Items Added</h1>
       )

        }

     


      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges} </p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          placeholder="Coupon Code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        {couponCode && 
           (
            isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon <VscError />
              </span>
            )
           )
        }

        {
          cartItems.length>0 &&
          <Link to='/shipping'>Checkout</Link> 
        }
      </aside>
    </div>
  );
}

export default Cart;
