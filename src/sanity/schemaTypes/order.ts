const order = {
    name: "order",
    type: "document",
    title: "Order",
    fields: [
        {
            name: "firstName",
            title: "First Name",
            type: "string",
        },
        {
            name: "lastName",
            type: "string",
            title: "Last Name",
        },
        {
            name: "email",
            type: "string",
            title: "E-mail",
        },
        {
            name: "address",
            type: "string",
            title: "Address",
        },
        {
            name: "shippingAddress",
            type: "string",
            title: "Shipping Address",
        },
        {
            name: "city",
            type: "string",
            title: "City",
        },
        {
            name: "country",
            type: "string",
            title: "Country",
        },
        {
            name: "zipCode", // Changed from "zipcode" to match dataset
            type: "string",
            title: "Zip Code",
        },
        {
            name: "phone",
            type: "string",
            title: "Phone",
        },
        {
            name: "cartItems", // Fixed typo: "carttItems" → "cartItems"
            type: "array",
            title: "Cart Items",
            of: [{ type: "reference", to: { type: "product" } }],
        },
        {
            name: "discount", // Added missing "discount" field
            type: "number",
            title: "Discount",
        },
        {
            name: "total", // Changed from "totalAmount" to match dataset
            type: "number",
            title: "Total Amount",
        },
        {
            name: "status",
            type: "string",
            title: "Order Status",
            options: {
                list: [
                    { title: "Pending", value: "Pending" },
                    { title: "Processing", value: "Processing" },
                    { title: "Shipped", value: "Shipped" },
                    { title: "Delivered", value: "Delivered" },
                    { title: "Cancelled", value: "Cancelled" },
                ],
                layout: "radio",
            },
            initialValue: "Pending",
        },
    ],
};

export default order;
