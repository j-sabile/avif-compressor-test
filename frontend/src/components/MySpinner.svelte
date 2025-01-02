<div class="lds-ellipsis">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<style>
  .lds-ellipsis,
  .lds-ellipsis div {
    box-sizing: border-box;
  }
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 20px; /* Further reduced size */
    height: 20px; /* Further reduced size */
  }
  .lds-ellipsis div {
    position: absolute;
    top: 50%; /* Center the divs vertically */
    width: 4px; /* Further reduced size */
    height: 4px; /* Further reduced size */
    border-radius: 50%;
    background: currentColor;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
    transform: translateY(-50%); /* Center the divs vertically */
  }
  .lds-ellipsis div:nth-child(1) {
    left: 2px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 2px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 10px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 18px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(8px, 0);
    }
  }
</style>
