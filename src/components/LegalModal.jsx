const DOCS = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'Last updated: May 2026',
    sections: [
      { type: 'intro', text: 'Taronga Tracka is an educational wildlife tracking app designed for use at Taronga Zoo, Sydney, by school groups and the general public. This Privacy Policy explains how we collect, use, and protect information when you use the app. If you have questions, contact us at cameron.rodgers3@det.nsw.edu.au' },
      { type: 'heading', text: '1. Who We Are' },
      { type: 'body', text: 'Taronga Tracka is an independent educational platform developed in partnership with Taronga Conservation Society Australia. The app is operated by Cameron King (Biology Bloke Education). References to "we", "us" or "our" in this policy refer to the app operator. We are committed to complying with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).' },
      { type: 'heading', text: '2. Our Privacy-by-Design Approach' },
      { type: 'body', text: 'Student anonymity is built in. Taronga Tracka does not collect or store student names. Students participate using a self-selected animal alias (e.g. "Red Kangaroo" or "Quokka"). The link between a student\'s real name and their alias is maintained only by their teacher — it never enters our platform. This means that the data stored in our systems cannot identify an individual student without the teacher\'s separate record. We consider this a core privacy protection, not an optional feature.' },
      { type: 'heading', text: '3. What Information We Collect' },
      { type: 'subheading', text: 'Students (School Mode)' },
      { type: 'list', items: ['Animal alias selected by the student (e.g. "Wombat")', 'Quiz responses and scores', 'Wildlife observation logs (animal sightings, notes)', 'Session activity data (which exhibits were visited)', 'Access code used to join a session'] },
      { type: 'body', text: 'No real names, email addresses, photos, or location data beyond zoo-enclosure proximity are collected from students.' },
      { type: 'subheading', text: 'Public Users (Public Mode)' },
      { type: 'list', items: ['Animal alias (self-selected)', 'Observation logs and quiz responses', 'Anonymous session identifiers'] },
      { type: 'subheading', text: 'Teachers' },
      { type: 'list', items: ['Email address (used for account sign-in)', 'School name (optional, provided at registration)', 'Class session data created and managed by the teacher'] },
      { type: 'subheading', text: 'Technical Data (all users)' },
      { type: 'body', text: 'Our platform uses Google Firebase, which automatically collects standard technical data including IP addresses, device type, browser type, and app usage patterns. This data is collected by Google on our behalf and governed by Google\'s privacy policies.' },
      { type: 'heading', text: '4. How We Use Your Information' },
      { type: 'list', items: ['Providing the core app functionality (tracking, quizzes, observations)', 'Enabling teachers to view their class\'s learning activity', 'Generating aggregate educational reports for teachers and administrators', 'Improving the app\'s content and performance', 'Communicating with teachers about their account (via email)'] },
      { type: 'body', text: 'We do not use student data for advertising, profiling, or any purpose unrelated to the educational experience at Taronga Zoo.' },
      { type: 'heading', text: '5. Children\'s Privacy' },
      { type: 'body', text: 'Taronga Tracka is designed specifically for use with school-age children and we take this responsibility seriously.' },
      { type: 'list', items: ['We do not collect names or contact details from students of any age', 'Student data is accessible only to their teacher within the platform', 'Teachers confirm at account registration that they have appropriate authority to use the platform with their students', 'We do not knowingly collect personal information directly from children under 16 without teacher or parental authorisation', 'If you believe a child\'s information has been collected inappropriately, contact us immediately'] },
      { type: 'heading', text: '5A. ZooSnooz — Video, Consent and Children' },
      { type: 'body', text: 'ZooSnooz is Taronga Tracka\'s documentary filmmaking feature, available in School Mode. Students film short wildlife clips during their excursion, which are compiled into a personalised documentary delivered on a Taronga Tag — an NFC keepsake students tap to watch their film — at the end of the visit.' },
      { type: 'body', text: 'Teacher confirmation is required before activating ZooSnooz. When a teacher activates ZooSnooz in their dashboard, they confirm via checkbox that appropriate notification or consent has been obtained from parents in accordance with their school\'s own policies. Taronga Tracka does not collect or hold signed consent forms.' },
      { type: 'subheading', text: 'How parent notification works' },
      { type: 'body', text: 'ZooSnooz operates on an opt-out model. Parents are notified before the excursion that their child will participate in ZooSnooz filming. Students participate by default unless a parent returns the opt-out slip to the teacher. A downloadable parent notification letter template — including an opt-out tear-off slip — is available to teachers from the Taronga Tracka teacher dashboard. Schools may use this template or their own equivalent notification process.' },
      { type: 'subheading', text: 'What parents are notified about' },
      { type: 'list', items: ['That their child will film short wildlife clips during the excursion', 'That footage will be uploaded securely to cloud storage (Google Firebase, Sydney) for processing', 'That footage may incidentally include other students, zoo staff, or members of the public', 'That clips will be compiled into a personalised documentary delivered on a Taronga Tag', 'That raw footage is permanently deleted within 48 hours of compilation', 'That the compiled documentary is accessible only via the student\'s private Taronga Tag link', 'How to opt their child out if they prefer not to participate'] },
      { type: 'subheading', text: 'Video data handling' },
      { type: 'list', items: ['Upload — footage uploaded directly to Firebase Storage over an encrypted connection', 'Access — raw footage accessible only to the supervising teacher and authorised Taronga Zoo staff', 'Processing — clips reviewed by the teacher and compiled into a documentary by the platform', 'Delivery — final documentary linked to the student\'s Taronga Tag via a unique, private, non-guessable URL', 'Deletion — all raw footage permanently deleted from Firebase Storage within 48 hours of documentary compilation', 'Documentary hosting — compiled documentaries hosted for 12 months from creation date, then deleted'] },
      { type: 'subheading', text: 'Other visitors in footage' },
      { type: 'body', text: 'Students filming at Taronga Zoo may incidentally capture other zoo visitors in the background. Teachers are responsible for instructing students to focus their footage on animals and enclosures and to minimise filming of uninvolved third parties. Footage that clearly and intentionally focuses on identifiable non-consenting adults should be removed by the teacher before compilation.' },
      { type: 'subheading', text: 'Teacher responsibility' },
      { type: 'body', text: 'By activating ZooSnooz in their dashboard, the teacher confirms that parents have been appropriately notified and that any opt-out requests have been honoured. Teachers who activate ZooSnooz without completing their school\'s notification process accept full responsibility for that use. We reserve the right to suspend ZooSnooz access for any school where this process has not been followed.' },
      { type: 'heading', text: '6. Data Storage and Security' },
      { type: 'body', text: 'Taronga Tracka is built on Google Firebase (Firestore), with data stored in Google\'s australia-southeast1 (Sydney) data centre. Your data does not leave Australia.' },
      { type: 'list', items: ['All data transmitted over encrypted HTTPS connections', 'Firestore security rules restrict access so each user sees only their own data', 'Teacher accounts are verified and approved before gaining dashboard access', 'Student data stored under anonymous aliases, not real names'] },
      { type: 'heading', text: '7. Sharing Your Information' },
      { type: 'body', text: 'We do not sell, rent, or trade any user information. Information may be shared only in the following limited circumstances:' },
      { type: 'list', items: ['Google Firebase / Google Cloud — our infrastructure provider, processing data under Google\'s Data Processing terms', 'Taronga Conservation Society Australia — aggregate, de-identified usage data may be shared for educational program reporting', 'Legal requirements — if required by Australian law or a court order'] },
      { type: 'body', text: 'No student-level data is ever shared with third parties for commercial purposes.' },
      { type: 'heading', text: '8. Cookies and Tracking' },
      { type: 'body', text: 'Taronga Tracka uses cookies and similar technologies provided by Google Firebase to maintain sessions, remember preferences, and collect anonymous usage statistics. We do not use advertising cookies or third-party tracking pixels.' },
      { type: 'heading', text: '9. Data Retention' },
      { type: 'body', text: 'We retain data for the following periods:' },
      { type: 'list', items: ['Student session data — retained for the school year created, deleted within 30 days of year\'s end', 'Teacher accounts — retained while active; deleted within 30 days of deletion request', 'Public user sessions — retained for 90 days, then automatically purged', 'ZooSnooz raw video footage — permanently deleted within 48 hours of documentary compilation', 'ZooSnooz compiled documentaries — hosted for 12 months from creation, then deleted', 'Aggregate analytics — may be retained indefinitely in de-identified form'] },
      { type: 'body', text: 'Teachers may request early deletion of any ZooSnooz footage or compiled documentary at any time. Deletion will be completed within 48 hours of the request.' },
      { type: 'heading', text: '10. Your Rights' },
      { type: 'body', text: 'Under the Australian Privacy Principles, you have the right to:' },
      { type: 'list', items: ['Request access to personal information we hold about you', 'Request correction of inaccurate information', 'Request deletion of your information', 'Make a complaint about how your information has been handled'] },
      { type: 'heading', text: '11. Changes to This Policy' },
      { type: 'body', text: 'We may update this Privacy Policy from time to time. For significant changes affecting school users, we will notify registered teachers by email. Continued use of the app after changes constitutes acceptance of the updated policy.' },
      { type: 'heading', text: '12. Complaints' },
      { type: 'body', text: 'If you believe we have not handled your personal information appropriately, please contact us first. We will respond within 30 days. If you remain dissatisfied, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC): Website: www.oaic.gov.au | Phone: 1300 363 992' },
      { type: 'heading', text: 'Contact Us' },
      { type: 'body', text: 'Privacy Officer — Taronga Tracka\nEmail: cameron.rodgers3@det.nsw.edu.au\nWebsite: tarongatracka.com.au' },
    ],
  },
  terms: {
    title: 'Terms of Use',
    updated: 'Last updated: May 2026',
    sections: [
      { type: 'intro', text: 'These Terms of Use govern your access to and use of Taronga Tracka ("the app"), an educational wildlife tracking platform for use at Taronga Zoo, Sydney. By using the app, you agree to these terms. If you are a teacher using the app with students, these terms apply to you and to your use on behalf of your students and school.' },
      { type: 'heading', text: '1. About Taronga Tracka' },
      { type: 'body', text: 'Taronga Tracka is an educational platform developed by Cameron King (Biology Bloke Education) in partnership with Taronga Conservation Society Australia. The app supports curriculum-aligned wildlife learning experiences for school groups and individual visitors at Taronga Zoo.' },
      { type: 'list', items: ['School Mode — for teacher-led school excursions, accessed via a class code', 'Public Mode — for individual visitors exploring the zoo independently'] },
      { type: 'heading', text: '2. Acceptance of Terms' },
      { type: 'body', text: 'By accessing or using Taronga Tracka, you confirm that:' },
      { type: 'list', items: ['You have read and agree to these Terms of Use', 'You have read and agree to our Privacy Policy', 'If you are a teacher, you have the authority to agree to these terms on behalf of your school and students', 'If you are under 18, a parent, guardian, or teacher has authorised your use of the app'] },
      { type: 'heading', text: '3. Teacher Accounts and Responsibilities' },
      { type: 'body', text: 'Teachers are responsible for their class\'s use of the app. By registering a teacher account, you accept the responsibilities set out in this section.' },
      { type: 'subheading', text: 'Account Registration' },
      { type: 'list', items: ['Accounts require email and password authentication', 'You must provide accurate information when registering', 'You are responsible for keeping your login credentials secure'] },
      { type: 'subheading', text: 'Supervising Students' },
      { type: 'list', items: ['Teachers must be present and supervising students during use of the app at Taronga Zoo', 'You are responsible for ensuring students use the app appropriately', 'You must maintain your own record of which animal alias corresponds to which student — this information is not stored in the app', 'You must not share your teacher access code or dashboard access with students'] },
      { type: 'subheading', text: 'Consent' },
      { type: 'list', items: ['By using the app with students, you confirm that your school has obtained any necessary parental consent for student participation in digital educational tools', 'You confirm that use of this app is consistent with your school\'s own technology policies'] },
      { type: 'heading', text: '4. Student Use' },
      { type: 'body', text: 'Students access the app in School Mode under the supervision of their teacher.' },
      { type: 'list', items: ['Students select an animal alias — real names are not entered into the app', 'Students must use the app only for its intended educational purpose', 'Students must not attempt to access other students\' data or the teacher dashboard', 'Students must follow their teacher\'s instructions regarding use of the app during excursions'] },
      { type: 'heading', text: '5. Acceptable Use' },
      { type: 'body', text: 'All users agree not to:' },
      { type: 'list', items: ['Use the app for any purpose other than legitimate educational or recreational wildlife exploration at Taronga Zoo', 'Attempt to access accounts, data, or system areas you are not authorised to access', 'Attempt to reverse engineer, copy, modify, or distribute the app or its content', 'Submit false, misleading, or harmful content through observation logs or quiz responses', 'Use automated tools, bots, or scripts to interact with the app', 'Share access codes or teacher credentials with unauthorised users'] },
      { type: 'heading', text: '6. Intellectual Property' },
      { type: 'body', text: 'All content within Taronga Tracka — including animal information, quiz content, educational materials, design, and code — is owned by Cameron King (Biology Bloke Education) or licensed from Taronga Conservation Society Australia. You may not reproduce, distribute, or commercially exploit any app content without written permission. Teachers may use app-generated reports and data for internal school educational purposes.' },
      { type: 'heading', text: '7. Animal Information and Educational Content' },
      { type: 'body', text: 'Taronga Tracka provides educational content about wildlife and conservation. While we strive for accuracy, animal information is provided for educational purposes and may not reflect the most current scientific knowledge. The app is not a substitute for direct engagement with Taronga Zoo\'s education staff or keeper presentations.' },
      { type: 'heading', text: '8. Availability and Changes' },
      { type: 'list', items: ['The app may be unavailable during maintenance, updates, or unforeseen outages', 'We reserve the right to modify, update, or discontinue features of the app at any time', 'Animal availability and enclosure locations at Taronga Zoo may change — the app reflects information current at the time of last update', 'We will endeavour to notify registered teachers of significant changes by email'] },
      { type: 'heading', text: '9. Limitation of Liability' },
      { type: 'body', text: 'To the maximum extent permitted by Australian law:' },
      { type: 'list', items: ['Taronga Tracka is provided "as is" without warranties of any kind', 'We are not liable for any loss of data, interrupted access, or reliance on app content during a school excursion', 'We are not responsible for the actions of students or any third parties using the app', 'Our total liability to any user is limited to the amount paid (if any) to access the app'] },
      { type: 'body', text: 'Nothing in these terms limits liability for fraud, death, or personal injury caused by negligence, or any liability that cannot be excluded under the Australian Consumer Law.' },
      { type: 'heading', text: '10. Third-Party Services' },
      { type: 'body', text: 'Taronga Tracka uses Google Firebase as its backend infrastructure. By using the app, you acknowledge that Google\'s own Terms of Service and Privacy Policy apply to the underlying infrastructure. The app does not include third-party advertising, social media integrations, or affiliate links.' },
      { type: 'heading', text: '11. Termination' },
      { type: 'body', text: 'We reserve the right to suspend or terminate any account that violates these Terms of Use, poses a risk to other users or the platform, or has been inactive for more than 24 months. Teachers may close their account at any time by contacting us. Upon closure, associated class data will be deleted within 30 days.' },
      { type: 'heading', text: '12. Governing Law' },
      { type: 'body', text: 'These Terms of Use are governed by the laws of New South Wales, Australia. Any disputes will be subject to the exclusive jurisdiction of the courts of New South Wales.' },
      { type: 'heading', text: '13. Changes to These Terms' },
      { type: 'body', text: 'We may update these Terms of Use from time to time. For material changes affecting school users, registered teachers will be notified by email. Continued use of the app after changes take effect constitutes acceptance of the updated terms.' },
      { type: 'heading', text: 'Questions or Concerns' },
      { type: 'body', text: 'Cameron King — Taronga Tracka\nEmail: cameron.rodgers3@det.nsw.edu.au\nWebsite: tarongatracka.com.au' },
    ],
  },
};

export default function LegalModal({ doc, onClose }) {
  const { title, updated, sections } = DOCS[doc];

  return (
    <div
      onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background:'#fff', borderRadius:'20px', width:'100%', maxWidth:'640px', maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ background:'#0A2F1F', padding:'1.25rem 1.75rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div>
            <p style={{ margin:0, color:'rgba(255,255,255,0.5)', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase' }}>Taronga Tracka</p>
            <h2 style={{ margin:'2px 0 0', color:'#fff', fontSize:'1.15rem', fontWeight:700 }}>{title}</h2>
          </div>
          <button
            onClick={onClose}
            style={{ background:'rgba(255,255,255,0.12)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'50%', fontSize:'1.1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            &#10005;
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY:'auto', padding:'1.5rem 1.75rem', flex:1 }}>
          <p style={{ margin:'0 0 1.25rem', color:'#888', fontSize:'0.78rem', fontStyle:'italic' }}>{updated}</p>

          {sections.map((s, i) => {
            if (s.type === 'heading') return (
              <h3 key={i} style={{ margin:'1.4rem 0 0.4rem', color:'#0A2F1F', fontSize:'0.95rem', fontWeight:700, borderBottom:'1px solid #e8f0ea', paddingBottom:'0.3rem' }}>{s.text}</h3>
            );
            if (s.type === 'subheading') return (
              <p key={i} style={{ margin:'0.9rem 0 0.25rem', color:'#1B6B3A', fontSize:'0.85rem', fontWeight:700 }}>{s.text}</p>
            );
            if (s.type === 'intro') return (
              <p key={i} style={{ margin:'0 0 1rem', color:'#444', fontSize:'0.88rem', lineHeight:1.7, background:'#f4f8f5', borderRadius:'10px', padding:'0.9rem 1rem', borderLeft:'3px solid #1B6B3A' }}>{s.text}</p>
            );
            if (s.type === 'list') return (
              <ul key={i} style={{ margin:'0.25rem 0 0.75rem 0', paddingLeft:'1.3rem' }}>
                {s.items.map((item, j) => (
                  <li key={j} style={{ color:'#444', fontSize:'0.85rem', lineHeight:1.7, marginBottom:'0.2rem' }}>{item}</li>
                ))}
              </ul>
            );
            return (
              <p key={i} style={{ margin:'0.25rem 0 0.75rem', color:'#444', fontSize:'0.85rem', lineHeight:1.7, whiteSpace:'pre-line' }}>{s.text}</p>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding:'0.9rem 1.75rem', borderTop:'1px solid #e8f0ea', flexShrink:0, textAlign:'center' }}>
          <button
            onClick={onClose}
            style={{ background:'linear-gradient(135deg,#1B6B3A,#0A2F1F)', color:'#fff', border:'none', borderRadius:'40px', padding:'0.6rem 2rem', fontSize:'0.88rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.05em' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
