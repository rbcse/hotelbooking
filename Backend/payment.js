import Razorpay from "razorpay";

const RAZORPAY_ID = 'rzp_test_3iOCKgVRiHQapy';
const RAZORPAY_SECRET_KEY = 'cK0mxg3shecsC2TQ4IbVGXr8';

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_ID,
    key_secret: RAZORPAY_SECRET_KEY
});

const createOrder = async (req, res) => {
    try {
        const amount = req.body.amount * 100;
        const options = {
            amount: amount,
            currency: "INR",
            receipt: "razorpayUser@gmail.com"
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: RAZORPAY_ID,
                    product_name: req.body.name,
                    description: req.body.description,
                    contact: "8567345632",
                    name: "Rahul Birawat",
                    email: "rahul@gmail.com",
                    checkin:req.body.checkin,
                    checkout : req.body.checkout
                });
            } else {
                console.error("Razorpay order creation error:", err);
                res.status(400).send({ success: false, msg: 'Something went wrong!' });
            }
        });
    } catch (err) {
        console.error("Error in createOrder:", err);
        res.status(500).send({ success: false, msg: 'Server error' });
    }
};

export { createOrder };
