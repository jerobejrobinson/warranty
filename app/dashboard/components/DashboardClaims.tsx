'use client'
import { createClient } from "@/app/utils/supabase/client"
import React, { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { status } from '@/lib/statusBadge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function paginate(total: number, page: number) {
  let pages = []
  if (total <= 5) {
    for (let i = 0; i < total; i++) {
      pages.push(i)
    }
  } else {
    if (page < 3) {
      pages = [0, 1, 2, 3, 4]
    } else if (page > total - 3) {
      pages = [total - 5, total - 4, total - 3, total - 2, total - 1]
    } else {
      pages = [page - 2, page - 1, page, page + 1, page + 2]
    }
  }
  return pages
}


export default function DashboardClaims() {
  const [claims, setClaims] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const supabase = createClient()

  const fetchClaims = async () => {
    const { count, data: claims, error } = await supabase
      .from('claim')
      .select('id, date_submitted, part_number, price, profiles ( company_name, first_name, last_name, email ), rga ( status )', { count: 'exact' })
      .range(page * 5, page * 5 + 5)
      
    if (error) {
      console.error(error)
    } else {
      setClaims(claims)
      // total number of pages
      if(count) setTotal(Math.ceil(count / 5))
    }
  }

  const getPage = async (page: number) => {
    setPage(page)
  }

  useEffect(() => {
    (async () => {
      await fetchClaims()
    })()
    setPages(paginate(total, page))
  }, [])
  console.log(pages)
  console.log(total)
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Claims</CardTitle>
        <CardDescription>Recent claims submissions from customers.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Product</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims && claims.map((claim: any, index: number)  => (
              <TableRow className="bg-accent" key={index}>
                <TableCell>
                  <div className="font-bold">{claim.profiles.company_name}</div>
                  <div className="font-medium">{claim.profiles.first_name} {claim.profiles.last_name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">{claim.profiles.email}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{claim.part_number}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className="text-xs" variant="secondary">
                    {status(claim)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{claim.date_submitted.slice(0, 10)}</TableCell>
                <TableCell className="text-right">{'$'}{claim.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}
