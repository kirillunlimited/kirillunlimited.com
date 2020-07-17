const GA_ID = 'UA-66919152-4';

const initAnalytics = function() {
  /** Validate GA tracking ID */
  if (!GA_ID) {
    console.error('GA tracking ID is missing');
    return;
  }
  if (!parseInt(GA_ID.substring(3))) {
    console.error(`GA tracking ID is invalid: "${GA_ID}"`);
    return;
  }

  /** Init GA */
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', GA_ID, 'auto');
  ga('send', 'pageview');

  /** Delegate clicks and attach GA events on link clicks */
  document.addEventListener('click', function(e) {
    const linkElement = e.target.closest('a');
    if (linkElement) {
      const title = linkElement.getAttribute('title');
      ga('send', 'event', title, 'Click');
    }
  });
};

export default initAnalytics;