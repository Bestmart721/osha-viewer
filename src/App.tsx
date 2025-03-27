// --- frontend/src/App.tsx ---
import { MDBAccordion, MDBAccordionItem, MDBBtn, MDBContainer, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBNavbar, MDBNavbarBrand, MDBSpinner, MDBTypography } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';

interface DateItem {
  date: string;
  title: string;
  url: string;
}

interface YearData {
  _id: string;
  year: number;
  dates: DateItem[];
  url: string;
}

interface OshaEntry {
  _id: string;
  title: string;
  url: string;
  date: string;
  standardNumbers: { text: string; url: string }[];
  content: string;
}

function App() {
  const [years, setYears] = useState<YearData[]>([]);
  const [oshaEntries, setOshaEntries] = useState<OshaEntry[]>([]);
  const [spinner, setSpinner] = useState(true);
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);

  useEffect(() => {
    setSpinner(true);
    fetch('https://1wxsfs7z3d.execute-api.us-east-2.amazonaws.com/prod/')
      .then(res => res.json())
      .then((res) => {
        setYears(res.body);
      }).finally(() => {
        setSpinner(false);
      });
  }, []);

  const handleDateClick = (dateStr: string) => {
    setSpinner(true);
    fetch(`https://tqaylbw8b3.execute-api.us-east-2.amazonaws.com/prod?date=${dateStr}`)
      .then(res => res.json())
      .then((data) => {
        console.log(data);
        setOshaEntries(data);
        setBasicModal(true);
      }).finally(() => {
        setSpinner(false);
      });
  };

  return (
    <>
      <MDBNavbar light fixed='top' bgColor='primary'>
        <MDBContainer fluid>
          <MDBNavbarBrand href='#'>
            <img
              src='https://www.osha.gov/themes/contrib/ddp_dol_theme/img/Agency_DOL_Logo_dark.svg'
              height='50'
              alt=''
              loading='lazy'
            />
            <h3 className='mb-0 ms-2 text-white'>Standard Interpretations</h3>
          </MDBNavbarBrand>
          <MDBTypography tag='h6' className='text-white'>
            Full Stack Content Developer Exercise © Created by
            <a href='mailto:matt.fsliger@gmail.com' className='text-white ms-1 hover-underline'>
              <b>Matthew Sliger</b>
            </a>
          </MDBTypography>
        </MDBContainer>
      </MDBNavbar>

      <div className='container my-4'>&nbsp
      </div>
      <div className='container my-5'>
        <MDBAccordion flush initialActive={1}>
          {years.map((year) => (
            <MDBAccordionItem key={year._id} headerTitle={year.year} collapseId={year.year}>
              <ul>
                {year.dates.map((d, i) => (
                  <li key={i}>
                    <a onClick={() => handleDateClick(d.date)} className='hover-underline cursor-pointer'>
                      {d.date} - {d.title}
                    </a>
                  </li>
                ))}
              </ul>
            </MDBAccordionItem>
          ))}
        </MDBAccordion>

        <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
          <MDBModalDialog size='fullscreen'>
            {
              oshaEntries.map((osha) => (<MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>{osha.title}</MDBModalTitle>
                  <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <p dangerouslySetInnerHTML={{ __html: osha.content.replace(/href="/g, 'target="_blank" href="https://www.osha.gov') }}></p>
                </MDBModalBody>
                <MDBModalFooter>
                  <p>Publication Date: <b>{osha.date}</b></p>

                  <a href={osha.url} target='_blank' rel='noreferrer' className='ms-auto'>
                    <MDBBtn color='primary'>Read More</MDBBtn>
                  </a>
                  <MDBBtn color='secondary' onClick={toggleOpen}>Close</MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>))
            }
          </MDBModalDialog>
        </MDBModal>

        {
          spinner &&
          <div className='d-flex justify-content-center vh-100 align-items-center position-fixed top-0 start-0 w-100 h-100 bg-opacity-50 bg-dark'>
            <MDBSpinner color='white' className='me-2' style={{ width: '3rem', height: '3rem' }}>
              <span className='visually-hidden'>Loading...</span>
            </MDBSpinner>
          </div>
        }
      </div>
    </>
  );
}

export default App;
