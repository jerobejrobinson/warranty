export default async function CustomerTable({customerName, accountNumber, salesRepId, totalInvoiceAmount}: {customerName: string; accountNumber: number; salesRepId: string; totalInvoiceAmount: number;}) {
    return (
        <>
            {/* Customer Data Table */}
            <table className="rounded-xl overflow-hidden bg-white p-10 w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Customer Name</th>
                        <th className="px-4 py-2">Account Number</th>
                        <th className="px-4 py-2">Salesperson Id</th>
                        <th className="px-4 py-2">Invoice Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-200 px-4 py-2 font-medium">{customerName}</td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">{accountNumber}</td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">{salesRepId}</td>
                        <td className="border border-gray-200 px-4 py-2 font-medium">${totalInvoiceAmount}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td className="px-4 py-2"></td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}