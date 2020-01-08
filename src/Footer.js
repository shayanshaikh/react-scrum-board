import React from "react";
import './index.css';
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";

const Footer = () => {
  return (
    <MDBFooter color="blue" id="footer" className="font-small pt-4">
      <MDBContainer fluid className="text-center text-md-left">
        <MDBRow className="footerDesc">
          <MDBCol md="6">
            <h5 className="title">The Scrum Methodolgy</h5>
            <p>
              Here you can learn to use Scrum principles to manage and organize any project.
            </p>
          </MDBCol>
          <MDBCol md="6">
            <h5 className="title">Recommended Readings</h5>
            <ul>
              <li className="list-unstyled">
                <a href="https://www.goodreads.com/book/show/19288230-scrum">Art of Scrum</a>
              </li>
              <li className="list-unstyled">
                <a href="https://www.goodreads.com/book/show/13663747-essential-scrum?from_search=true&qid=p13qc7Q1NI&rank=1">Essential Scrum</a>
              </li>
              <li className="list-unstyled">
                <a href="https://www.goodreads.com/book/show/18165261-scrum-mastery?ac=1&from_search=true&qid=LXTySB4B00&rank=1">Scrum Mastery</a>
              </li>
              <li className="list-unstyled">
                <a href="https://www.goodreads.com/book/show/7181943-scrum-product-ownership----balancing-value-from-the-inside-out">Scrum Product Ownership</a>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="https://www.shayanshaikh.com"> Shayan Shaikh </a>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default Footer;