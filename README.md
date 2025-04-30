1. how to fix typescript error in dynamic_page_routes_for_invoices:
   Update your Code: You can handle the params by awaiting them in your function as follows:
   type Params = Promise<{ slug: string[] }>;
   export default async function Page({ params }: { params: Params }) {
   const { slug } = await params;
   }
