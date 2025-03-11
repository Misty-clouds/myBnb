import Table from "@/components/Tables/Booking_table/render"

export default function testPage(){
    const company_id = "1ea65b045-4b98-4c80-be17-e21e8ffa2fea";
    return(
        <div>
            <h1>Test Page</h1>
            <Table company_id={company_id} />
        </div>
    )
}