<?php

namespace App\Http\Controllers;

use App\User;
use App\Loging;
use App\Order;
use App\Product;
use App\OrderReport;
use Illuminate\Http\Request;

class OrderController extends Controller
{
	public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = User::all();
        $order = Order::getOrderData();
        $product = Product::getProductData();
        $status = "";
    	return view('order.index', compact('order', 'user', 'product'));
    }

    public function tambah(Request $request)
    {
        $user_id = $request->user_id;
        $product_id = $request->product_id;
        $order_desc = $request->order_desc;
        $order_status = $request->debcrd;
        $order_amount = $request->order_amount;

        $user_point = User::getUserPoint($user_id);

        $point = Order::setPoint($user_id, $order_amount);

        $data_order = [
            'order_user_id' => $user_id,
            'order_produk_id' => $product_id,
            'order_amount' => $order_amount,
            'order_status' => $order_status,
            'order_desc' => $order_desc,
            'order_transaction_point' => $point,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $response = Order::saveData($data_order);
        User::setUserPoint($user_id, $user_point[0]->transaction_point + $point);

        $or_credit = $or_debit = 0;
        if ($order_status == "C") {
            $or_credit = $order_amount;
        } else {
            $or_debit = $order_amount;
        }

        $order_id = Order::getLastId();
        $data_order_report = [
            'or_user_id' => $user_id,
            'or_order_id' => $order_id,
            'or_order_amount' => $order_amount,
            'or_credit' => $or_credit,
            'or_debit' => $or_debit
        ];
        OrderReport::saveData($data_order_report);
        Loging::insert([
            'request' => json_encode($data_order),
            'response' => $response,
            'action' => 'add data for order : ' . $order_id,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        return redirect()->route('order.index')->with('message', 'add data for order : ' . $order_id);
    }
}