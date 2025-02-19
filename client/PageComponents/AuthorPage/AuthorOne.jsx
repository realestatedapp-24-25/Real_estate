import React from "react";

const AuthorOne = ({address}) => {
  return (
    <div class="rn-author-bg-area bg_image--9 bg_image ptb--150">
      <div class="container">
        <div class="row">{address}</div>
      </div>
    </div>
  );
};

export default AuthorOne;
