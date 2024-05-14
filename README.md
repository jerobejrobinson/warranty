#  Tools for project 
- :black_square_button: Think about supabase auth secruity
- :white_check_mark: Intergrate [shadcn/ui](https://ui.shadcn.com) for it's UI components
- :black_square_button: Intergrate [Posthog](https://posthog.com) / better version of Google Analytics
- :black_square_button: Intergrate [Trigger.dev](https://trigger.dev/) to create background jobs
- :black_square_button: Intergrate [React Query](https://tanstack.com/query/) for async state management
- :black_square_button: Intergrate [date-fns](https://date-fns.org/) for date management and formating
- :black_square_button: Intergrate [Postmark](https://postmarkapp.com) for emails (Transactional, Inbound and Broadcast)

# Basic Functions of app
1. The user logs in to submit claim
2. Claims start out by selecting the part brand
3. Then have the user enter the part number
4. Using data fabric compass, we will find invoices with that part
5. Display the available invoices to user
6. Allow user to select invoice for part
7. Enter the rest of warranty claim details

# Error Handling Todos
- :black_square_button: handle signup page errors
- :black_square_button: handle login page errors

# Validation Todos
- :black_square_button: Need to add zod validation to getInvoicesByPartNumber server action

# Auth Todos
- :black_square_button: Reset set accout password page
- :black_square_button: Create a siteadmin account - this account will be able to view all account on the site and assign them to roles.
- - The roles will either be Admin, Salesperson, or Profile

# Create Claim Todos
- :black_square_button: Create a btn that links to `/dashboard/claims/create`

# Invoice Lookup Todos
- :black_square_button: search invoices by date range
- :black_square_button: search invoices by part number

# Objects / Table
The initial claim object sent to DB.
```
CLAIM
{
    id: UUID, // Will be made by database upon entry
    date_submitted: timestamptz,
    part_number: string,
    vin: string,
    serial: string,
    year: number,
    make: string,
    model: string,
    install_date: timestamptz,
    mileage_installed: number,
    mileage_failed: number,
    symptoms: string,
    diagnostics: string,
    labor_hours: number,
    qty: number,
    price: number,
    invoice_number: string,
    profile_id: uuid,
    // --- //
    rga_id: uuid, // Will not have one starting out
    shipment_id: uuid, // Will not have one starting out

}
```

