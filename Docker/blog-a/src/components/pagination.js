import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronLeft, faCircleChevronRight } from "@fortawesome/free-solid-svg-icons"

const style = {
  marginRight: '5px'
};

const Pagination = ({ pageContext }) => {
  const { numberOfPages, humanPageNumber, previousPagePath, nextPagePath } = pageContext;
  const pages = Array.from({ length: numberOfPages }, (v, i) => i + 1);

  return (
    <div className="pagination">
      {
        previousPagePath
          ? <Link to={previousPagePath} style={style}>
              <FontAwesomeIcon icon={faCircleChevronLeft} className="faCircleChevronLeft" />
            </Link>
          : null
      }
      {
        nextPagePath
          ? <Link to={nextPagePath} style={style}>
              <FontAwesomeIcon icon={faCircleChevronRight} className="faCircleChevronRight" />
            </Link>
          : null
      }
    </div>
  );
}

export default Pagination
