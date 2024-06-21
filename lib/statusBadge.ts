export function status(claim: any) {
    let status = null
    if(!claim.shipment) {
        return 'submitted'
    }
    if(claim.shipment.drop_off) {
        status = 'Will be dropping off at Memphis location'
    } else {
        status = 'Waiting for shipping label'
    }
    if(claim.rga) {
        status = 'submission aknowledged RGA number generated'
    }

    return status
}
export function displayRGANumber(claim: any) {
    if(!claim.rga) {
        return 'Pending'
    } else {
        return claim.rga.rga_number
    }
}