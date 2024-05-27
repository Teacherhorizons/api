main();

function main() {
  // update document title to match url (initially and on navigation)
  document.addEventListener('DOMContentLoaded', function () {
    document.title = getLastPartOfUrl(window.location.href);
  });
  navigation.addEventListener('navigate', (e) => {
    setTimeout(() => {
      document.title = getLastPartOfUrl(e.destination.url);
    }, 0);
  });

  // TODO: add comment
  const mutationObserverCallback = () => {
    const el = document.querySelector('.menu-content');
    if (el) {
      mutationObserver.disconnect();
      menuLoaded();
    }
  };
  const mutationObserver = new MutationObserver(mutationObserverCallback);
  mutationObserver.observe(document.body, { subtree: true, childList: true });
}

function getLastPartOfUrl(url) {
  return getLastPartOfString(url, '/');
}

function getLastPartOfString(s, separator) {
  const parts = s.split('/');
  return parts[parts.length - 1];
}

function menuLoaded() {
  createExpandableMenuGroups();
  // wip();
}

function createExpandableMenuGroups() {
  document.querySelectorAll('li[data-item-id*="group/"]').forEach((el) => {
    // set visibility as remembered and create behaviour
    const name = el.getAttribute('data-item-id');
    el.children[1].hidden = window.localStorage.getItem(name) == 'true';

    const label = el.children[0];
    label.style.cursor = 'pointer';

    label.onclick = function () {
      // toggle visibility and save to local storage
      const children = this.parentElement.children[1];
      children.hidden = !children.hidden;

      const name = this.parentElement.getAttribute('data-item-id');
      window.localStorage.setItem(name, children.hidden);
    };
  });
}

function wip() {
  document.querySelectorAll('a[href*="#tag/"]').forEach((el) => {
    const button1 = document.createElement('button');
    button1.innerText = 'Expand all';
    // el.getele
    el.parentElement.appendChild(button1);
    // el.insertBefore(button, el.firstChild);
    button1.classList.add('expandAllButton');
    console.log(101, el, button1);

    button1.onclick = function () {
      console.log(
        102,
        this,
        this.innerText,
        this.parentElement,
        this.parentElement.parentElement.parentElement.parentElement
      );
      const foo = this.parentElement.parentElement.parentElement.parentElement;
      const action = this.innerText == 'Expand all' ? 'expand' : 'collapse';
      expandOrCollapseAllSchemas(foo, action);
      this.innerText = action == 'expand' ? 'Collapse all' : 'Expand all';
    };

    const button2 = document.createElement('button');
    button2.innerText = 'Locate';
    el.parentElement.appendChild(button2);
    button2.classList.add('locateButton');

    button2.onclick = function () {
      // TODO: consider doing this but on initial load (for # in url)
      document.querySelector('li[data-item-id="tag/applications/operation/getApplications"]').scrollIntoView();
      document.querySelector('div[data-section-id="operation/getApplications"]').scrollIntoView();
    };
  });
}

// related issue: schemas are not expanded (https://github.com/Redocly/redoc/issues/593)
// workaround (hack): add a button which will expand all schemas
// future: keep an eye on the issue; make less hacky
function expandOrCollapseAllSchemaSectionsInCurrentDom(el, action) {
  const q =
    action == 'expand'
      ? 'tr:not(.expanded) > td > button[aria-label*=expand]'
      : 'tr.expanded > td > button[aria-label*=expand]';
  el.querySelectorAll(q).forEach((btn) => {
    btn.click();
  });
}

function expandOrCollapseAllSchemas(el, expand) {
  const expandInterval = setInterval(() => expandOrCollapseAllSchemaSectionsInCurrentDom(el, expand), 150);
  setTimeout(() => clearInterval(expandInterval), 3000);
}
