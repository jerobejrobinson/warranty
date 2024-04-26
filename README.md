
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