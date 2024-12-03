import {
  initializeKhaltiPayment,
  verifyKhaltiPayment,
} from "../services/khaltiService.js";
import { Item } from "../models/itemModel.js";
import { PurchasedItem } from "../models/purchasedItemModel.js";
import { Payment } from "../models/paymentModel.js";

// Initialize Payment
export const initializePayment = async (req, res) => {
  try {
    const { itemId, totalPrice, website_url } = req.body;

    const item = await Item.findOne({ _id: itemId, price: Number(totalPrice) });
    if (!item)
      return res
        .status(400)
        .json({ success: false, message: "Item not found" });

    const purchasedItem = await PurchasedItem.create({
      item: itemId,
      paymentMethod: "khalti",
      totalPrice: totalPrice * 100,
    });

    const paymentInit = await initializeKhaltiPayment({
      amount: totalPrice * 100,
      purchase_order_id: purchasedItem._id,
      purchase_order_name: item.name,
      return_url: `${process.env.BACKEND_URI}/complete-khalti-payment`,
      website_url,
    });

    res.json({ success: true, purchasedItem, payment: paymentInit });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Complete Payment
export const completePayment = async (req, res) => {
  try {
    const { pidx, transaction_id, amount, purchase_order_id} = req.query;

    const paymentInfo = await verifyKhaltiPayment(pidx);

    if (
      !paymentInfo ||
      paymentInfo.status !== "Completed" ||
      paymentInfo.transaction_id !== transaction_id || Number(paymentInfo.total_amount) !== Number(amount)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Incomplete or invalid payment",paymentInfo,});
    }

    const purchasedItem = await PurchasedItem.findOneAndUpdate(
      { _id: purchase_order_id, totalPrice: amount },
      { status: "completed" },
      { new: true }
    );
    if (!purchasedItem)
      return res
        .status(400)
        .json({ success: false, message: "Purchased item not found" });

    const paymentRecord = await Payment.create({
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount,
      dataFromVerificationReq: paymentInfo,
      paymentGateway: "khalti",
      status: "success",
    });

    res.json({ success: true, paymentRecord });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An error occured", error });
  }
};


export const testData = async (req,res)=>{
 const itemData = await Item.create({
    name:"headphone",
    price: 40,
    instock: true,
    category:"Electronic"
 })
 res.json({
    success:true,
    item:itemData
 })

}
