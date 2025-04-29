export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-6">About Itakarlapalli Sub Centre</h1>
      
      <div className="max-w-3xl text-lg space-y-6">
        <p>
          Established in 2012, the Itakarlapalli Sub Centre serves as a critical healthcare access point for the residents of Itakarlapalli village and nearby communities.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">Our Services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maternal and child health services</li>
          <li>Immunization programs</li>
          <li>Family planning services</li>
          <li>Basic medical treatment for common illnesses</li>
          <li>Health education and awareness</li>
          <li>Regular health check-ups</li>
          <li>Referral services to Primary Health Centre</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8">Staff</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>1 Auxiliary Nurse Midwife (ANM)</li>
          <li>1 Multi-Purpose Health Worker (Male)</li>
          <li>1 ASHA Worker per 1000 population</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8">Coverage Area</h2>
        <p>
          Our sub-centre covers Itakarlapalli village and 3 surrounding hamlets, serving a population of approximately 3,000 people.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8">Our Mission</h2>
        <p>
          To provide accessible, affordable, and quality healthcare services to all residents, with special focus on maternal and child health, disease prevention, and health promotion.
        </p>
      </div>
    </main>
  );
}