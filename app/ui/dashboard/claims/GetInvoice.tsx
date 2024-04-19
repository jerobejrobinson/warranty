'use client'
import Input from "@/app/ui/Input"
import { getInvoice, submitClaim } from "@/app/lib/actions"
import { useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import CustomerTable from "../CustomerTable";

type Invoice = {
    details: {
        customerName: string;
        accountNumber: string;
        salesRepId: string;
        totalInvoiceAmount: string;
    };
    parts: any;
    rawRes: any;
}

export default function GetInvoice(func: any) {
    const [invoiceData, setInvoiceData] = useState<Invoice | null>(null)
    const [vehicleData, setVehicleData] = useState<any>(null)
    const [page, setPage] = useState<number>(0)
    const [pageM, setPageM] = useState<number>(0)
    const [partSelection, setPartSelection] = useState<any>(null)
    const [radioSelection, setRadioSelection] = useState<any>()
    const [qtySelection, setQtySelection] = useState<any>()
    const [symptoms, setSymptoms] = useState<any>(null)
    const [diagnostics, setDiagnostics] = useState<any>(null)
    const [laborHours, setLaborHours] = useState<any>(null)
    const [status, setStatus] = useState<null | 'error' | 'success' | 'pending'>(null)

    // Get Invoice data function
    async function handleSubmit(formData: FormData) {
        const res = await getInvoice(formData)
        console.log(res)
        setInvoiceData(res)
    }

    // Part list management function
    function splitArray(arr: []) {
        const size = 7;
        let arrOfArr = [];
        for(let i = 0; i < arr.length; i += size) {
            arrOfArr.push(arr.slice(i, i+size))
        }
        return arrOfArr
    }
    function splitArrayM(arr: []) {
        const size = 5;
        let arrOfArr = [];
        for(let i = 0; i < arr.length; i += size) {
            arrOfArr.push(arr.slice(i, i+size))
        }
        return arrOfArr
    }

    // Grab radio selection
    function handleRadioSelection(e: any) {
        setRadioSelection(e.target.value)
    }

    // Grab Mobile Selection
    function handleMobileClick(e: any, obj: {}) {
        let json = JSON.stringify(obj)
        setRadioSelection(json)
    }
    // Grab input value
    function handleQtyInput(e: any) {
        setQtySelection(e.target.value)
    }
    // uncheck radio btns
    function resetValues() {
        let allRadioBtn = Array.from(document.querySelectorAll('.radioBtns'))
        let qtyInput = Array.from(document.querySelectorAll('.qtyInput'))
        let activeLabels = document.querySelector('.activeLabelClick')

        if(activeLabels) {
            activeLabels.classList.toggle('activeLabelClick')
        }
        // @ts-ignore
        allRadioBtn.forEach(value => value.checked = false)
        // @ts-ignore
        qtyInput.forEach(value => value.value = '')

        setRadioSelection(null)
        setQtySelection(null)
    }

    // Button handlers
    function handleBackBtn() {
        if(partSelection) {
            setPartSelection(null)
        } else {
            setInvoiceData(null)
        }
    }

    function handlePrevBtn(setPage: any) {
        resetValues()
        setPage((prev: any) => {
            if(prev === 0) {
                return 0
            } else {
                return prev - 1
            }
        })
    }
    function handleNextBtn(setPage: any, arr: any) {
        resetValues()
        setPage((prev: any) => {
            if(prev === arr.length - 1) {
                return arr.length - 1
            } else {
                return prev + 1
            }
        })
    }

    function submitPartValues() {
        const data = Object.assign(JSON.parse(radioSelection), invoiceData?.details)
        data.qty = qtySelection
        setPartSelection(data)
    }

    function handleVehicleSubmit(e: any) {
        e.preventDefault()
        const vin = document.getElementById('vin')
        const serial = document.getElementById('serial')
        const year = document.getElementById('year')
        const make = document.getElementById('make')
        const model = document.getElementById('model')
        const installDate = document.getElementById('installDate')
        const dateFailed = document.getElementById('dateFailed')
        const mileageInstalled = document.getElementById('mileageInstalled')
        const mileageFailed = document.getElementById('mileageFailed')

        const data = {
            // @ts-ignore
            vin: vin.value,
            // @ts-ignore
            serial: serial.value,
            // @ts-ignore
            year: year.value,
            // @ts-ignore
            make: make.value,
            // @ts-ignore
            model: model.value,
            // @ts-ignore
            installDate: installDate.value,
            // @ts-ignore
            dateFailed: dateFailed.value,
            // @ts-ignore
            mileageInstalled: mileageInstalled.value,
            // @ts-ignore
            mileageFailed: mileageFailed.value
        }
        setVehicleData(Object.assign(data, partSelection))
    }

    // Handle textarea input
    const handleTextaraInput = useDebouncedCallback((e: any, setFunction: any) => {
            setFunction(e.target.value)
        }, 300)

    // Handle Labor Hours
    function handleLaborHours(e: any) {
        setLaborHours(e.target.value)
    }

    // Submit Final Input 
    async function submitFinalInputs() {
        setStatus('pending')
        const data = Object.assign(vehicleData, {symptoms: symptoms, diagnostics: diagnostics, laborHours: laborHours})
        const res = await submitClaim(data)
        if(res.id) {
            setStatus('success')
        } else {
            setStatus('error')
        }
    }
    if(status === 'pending') {
        return (
            <div>
                Submitting claim
            </div>
        )
    }
    if(status === 'error') {
        return (
            <div>
                problem sending claim
            </div>
        )
    }
    if(status === 'success') {
        return (
            <div>
                Claim submitted Select Shipping options

            </div>
        )
    }
    if(vehicleData) {
        return (
            <div className="flex flex-col gap-4 h-full">
                <table className="hidden xl:table rounded-xl overflow-hidden bg-white p-10 w-full">
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
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.customerName}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.accountNumber}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.salesRepId}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${partSelection.totalInvoiceAmount}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Part List Table */}
                <table className="hidden xl:table rounded-xl bg-white p-10 w-full">
                    <thead className="w-full">
                        <tr>
                            <th className="px-4 py-2">Part Number</th>
                            <th className="px-4 py-2">Part Description</th>
                            <th className="px-4 py-2">Invoice Price</th>
                            <th className="px-4 py-2">Return Qty</th>
                            <th className="px-4 py-2">Credit Amount</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.prod}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium overflow-hidden">{partSelection.desc}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${partSelection.price}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.qty}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${Number(partSelection.price * partSelection.qty)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            
                        </tr>
                    </tfoot>
                </table>
                {/* Vehicle Information */}
                <div className="flex flex-row gap-4">
                    <div className="hidden xl:block p-4 bg-white rounded-lg w-1/3">
                        <div className="mb-4">
                            <p className="font-bold text-lg">Vehicle Information</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p>Vin</p>
                            <p>{vehicleData.vin}</p>
                            <p>Serial</p>
                            <p>{vehicleData.serial}</p>
                            <p>Year</p>
                            <p>{vehicleData.year}</p>
                            <p>Make</p>
                            <p>{vehicleData.make}</p>
                            <p>Model</p>
                            <p>{vehicleData.model}</p>
                            <p>Install Date</p>
                            <p>{vehicleData.installDate}</p>
                            <p>Date Failed</p>
                            <p>{vehicleData.dateFailed}</p>
                            <p>Mileage Installed</p>
                            <p>{vehicleData.mileageInstalled}</p>
                            <p>Mileage Failed</p>
                            <p>{vehicleData.mileageFailed}</p>
                        </div>
                    </div>
                    {/* Enter Symptoms and Diagnostics */}
                    <div className="p-4 bg-white rounded-lg w-full xl:w-2/3">
                        <div className="mb-4">
                            <p className="font-bold text-lg">Enter Symptoms & Diagnostics</p>
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="symptoms" className="h-full">
                                <span className="block text-sm">Describe Symptoms</span>
                                <textarea
                                    className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-200  focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                    placeholder=" "
                                    required
                                    onChange={(e) => handleTextaraInput(e, setSymptoms)}
                                >
                                </textarea>
                            </label>
                            <label htmlFor="Diagnostics"  className="h-full">
                                <span className="block text-sm">Diagnostics Test Performed</span>
                                <textarea
                                    className="h-full peer min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-200  focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                    placeholder=" "
                                    required
                                    onChange={(e) => handleTextaraInput(e, setDiagnostics)}
                                >
                                </textarea>
                            </label>
                        </div>
                        <div>
                            <Input type="number" name="laborHours" labelText="If Filling For Hours Include original & Replacement Work Orders" req={true} onChange={handleLaborHours}/>
                        </div>
                    </div>
                </div>
                <button className="bg-blue-400 text-white w-full p-4 rounded hover:bg-blue-600 tdansition-all" onClick={submitFinalInputs}>Submit Warranty Claim</button>
            </div>
        )
    }
    if(partSelection) {
        return (
            <div className="flex flex-col gap-4 h-full">
                {/* Customer Data Table - Hidden on smaller screens */}
                <table className="hidden xl:table rounded-xl overflow-hidden bg-white p-10 w-full">
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
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.customerName}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.accountNumber}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.salesRepId}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${partSelection.totalInvoiceAmount}</td>
                        </tr>
                    </tbody>
                </table>
                {/* Part List Table - Hidden on smaller screens */}
                <table className="hidden xl:table rounded-xl bg-white p-10 w-full">
                    <thead className="w-full">
                        <tr>
                            <th className="px-4 py-2">Part Number</th>
                            <th className="px-4 py-2">Part Description</th>
                            <th className="px-4 py-2">Invoice Price</th>
                            <th className="px-4 py-2">Return Qty</th>
                            <th className="px-4 py-2">Credit Amount</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.prod}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium overflow-hidden">{partSelection.desc}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${partSelection.price}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">{partSelection.qty}</td>
                            <td className="border border-gray-200 px-4 py-2 font-medium">${Number(partSelection.price * partSelection.qty)}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            
                        </tr>
                    </tfoot>
                </table>
                <form onSubmit={handleVehicleSubmit} className="p-4 bg-white rounded-lg">
                    <div className="mb-4">
                        <p className="font-bold text-lg">Enter Vehicle Information</p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input type="text" labelText="Vehicle Vin" req={true} name="vin" />
                        <Input type="text" labelText="Engine Serial" req={true} name="serial" />
                    </div>
                    <div className="flex flex-row gap-4">
                        <Input type="text" labelText="Year" req={true} name="year" />
                        <Input type="text" labelText="Make" req={true} name="make" />
                        <Input type="text" labelText="Model" req={true} name="model" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Input type="date" labelText="Install Date" req={true} name="installDate" />
                        <Input type="date" labelText="Date Failed" req={true} name="dateFailed" />
                        <Input type="text" labelText="Mileage Installed" req={true} name="mileageInstalled" />
                        <Input type="text" labelText="Mileage Failed" req={true} name="mileageFailed" />
                    </div>
                    <button type="submit" className="bg-blue-400 text-white w-full p-4 rounded !mt-4 hover:bg-blue-600 tdansition-all">Next</button>
                </form>
                <button className="p-4 bg-white round w-full xl:w-1/4" onClick={handleBackBtn}>Go Back To Part Selection</button>
            </div>
        )
    }
    if(invoiceData) {
        const partList = splitArray(invoiceData.parts)
        const partListM = splitArrayM(invoiceData.parts)
        return (
            <>
            {/* Mobile View */}
            <div className="xl:hidden h-full flex flex-wrap gap-1 w-full">
            <p className="text-sm w-full">Showing Page {pageM + 1} of {partListM.length}</p>
                {partListM[pageM].map((item: any, index: any) => (
                    <div key={index} className="w-full md:w-1/4">
                        <div className="grid grid-cols-4 p-2 text-sm rounded-lg bg-white "  onClick={(e) => {
                            handleMobileClick(e, {
                                prod: item.prod,
                                desc: item.desc1,
                                price: item.price
                            })
                            let active = document.querySelector('.activeLabelClick')
                            let label = document.querySelector(`#qtyLabelM_${index}`)
                            
                            if(active === label) {
                                label?.classList.toggle('activeLabelClick')
                            } else {
                                if(label) {
                                    label?.classList.toggle('activeLabelClick')
                                }
                                if(active) {
                                    active.classList.toggle('activeLabelClick')
                                }
                            }
                        }}>
                            <p className=" col-span-4 font-bold">{item.prod}</p>
                            <p className=" col-span-2 font-bold">Price: <span className="font-normal">${item.price}</span></p>
                            <p className=" col-span-2 font-bold">Qty Ordered: <span className=" font-normal">{item.qtyOrd}</span></p>
                            <p className="col-span-4">{item.desc1}</p>
                        </div>
                        <Input 
                            type="text" 
                            labelText="Enter Qty Being Returned" 
                            name={`qtyM_${index}`} 
                            id={`qtyLabelM_${index}`} 
                            req={true} 
                            className='bg-white !-mt-4 col-span-4 p-4 hidden'
                            onChange={handleQtyInput}
                        />
                    </div>
                ))}
                
                {/* Table Buttons */}
                <div className="flex flex-row justify-between mt-auto w-full">
                    <div className="flex flex-row gap-2">
                    <button className="p-2 bg-white round" onClick={handleBackBtn}>Go Back</button>
                    {/* Need to get data pull out selected data from Part List Table */}
                    <button className="p-2 bg-blue-400 hover:bg-blue-600 text-white round" onClick={submitPartValues}>Submit</button>
                    </div>
                    <div className="flex flex-row gap-2">
                        {pageM != 0 && <button className="bg-white p-2" onClick={() => handlePrevBtn(setPageM)}>Prev</button>}
                        {pageM != partListM.length - 1 && <button className="bg-white p-2" onClick={() => handleNextBtn(setPageM, partListM)}>Next</button>}
                    </div>
                </div>
            </div>
            {/* Laptop View */}
            <div className="hidden xl:flex flex-col gap-4 h-full">
                <CustomerTable 
                    customerName={invoiceData.details.customerName}
                    accountNumber={Number(invoiceData.details.accountNumber)}
                    salesRepId={invoiceData.details.salesRepId}
                    totalInvoiceAmount={Number(invoiceData.details.totalInvoiceAmount)}
                />
                {/* Part List Table */}
                <table className="rounded-xl bg-white p-10 w-full">
                    <thead className="w-full">
                        <tr>
                            <th className="px-4 py-2">Part Number</th>
                            <th className="px-4 py-2">Part Description</th>
                            <th className="px-4 py-2">Qty Ordered</th>
                            <th className="px-4 py-2">Price</th>
                            <th className="px-4 py-2">Select Part</th>
                            <th className="px-4 py-2">Enter Qty</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {partList[page].map((item: any, index: any) => (
                            <tr key={index}>
                                <td className="border border-gray-200 px-4 py-2 font-medium">{item.prod}</td>
                                <td className="border border-gray-200 px-4 py-2 font-medium overflow-hidden">{item.desc1}</td>
                                <td className="border border-gray-200 px-4 py-2 font-medium">{item.qtyOrd}</td>
                                <td className="border border-gray-200 px-4 py-2 font-medium">${item.price}</td>
                                <td className="border border-gray-200 px-4 py-2 font-medium"><input type="radio" name={`selectPart`} className="block mx-auto radioBtns" onClick={handleRadioSelection} value={JSON.stringify({
                                    prod: item.prod,
                                    desc: item.desc1,
                                    price: item.price
                                })}/></td>
                                <td className="border border-gray-200 px-4 py-2 font-medium bg-slate-400"><input type="text" name={`qty_${index}`} className="border border-gray-300 p-2 w-full qtyInput" onChange={handleQtyInput}/></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="px-4 py-2 text-sm">Showing Page {page + 1} of {partList.length}</td>
                        </tr>
                    </tfoot>
                </table>
                {/* Table Buttons */}
                <div className="flex flex-row justify-between mt-auto">
                    <div className="flex flex-row gap-4">
                    <button className="p-4 bg-white round" onClick={handleBackBtn}>Go Back</button>
                    {/* Need to get data pull out selected data from Part List Table */}
                    <button className="p-4 bg-blue-400 hover:bg-blue-600 text-white round" onClick={submitPartValues}>Submit</button>
                    </div>
                    <div className="flex flex-row gap-4">
                        {page != 0 && <button className="bg-white p-4" onClick={() => handlePrevBtn(setPage)}>Prev</button>}
                        {page != partList.length - 1 && <button className="bg-white p-4" onClick={() => handleNextBtn(setPage, partList)}>Next</button>}
                    </div>
                </div>
            </div>
            </>
        )
    }
    return (
        // Get Invoice data form - change server action function name to something more relevant
        <form action={handleSubmit} className="p-2 bg-white rounded">
            <Input name="invoiceNumber" type="text" req={true} labelText="Enter Original Invoice Number" className=''/>
            <button type="submit" className="bg-blue-400 text-white w-full p-4 rounded !mt-4 hover:bg-blue-600 tdansition-all">Next</button>
        </form>
    )
}