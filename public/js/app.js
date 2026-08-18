/*
 * Geol Diary
 *
 * 글을 추가할 때는 아래 CONTENTS 배열만 고치면 된다.
 *
 *   { name: '표시할 이름', file: 'posts 안의 파일명' }        -> 클릭하면 본문에 로드
 *   { name: '표시할 이름', children: [ ... ] }               -> 접히는 상위 목차 (깊이 제한 없음)
 *   { name: '표시할 이름', file: '...', children: [ ... ] }  -> 둘 다 가능
 */
(function () {
  'use strict';

  var CONTENTS = [
    {
      name: 'Project',
      file: 'project-20241101.html'
    },
    {
      name: 'Linear Algebra',
      children: [
        { name: 'Introduction', file: '20250201.html' }
      ]
    },
    {
      name: 'Posts',
      children: []
    }
  ];

  var POSTS_PATH = './posts/';

  var els = {};
  var activeLink = null;

  /* ------------------------------------------------------------ partial */

  /**
   * data-include-path 를 가진 요소를 해당 파일의 내용으로 치환한다.
   * 조각(partial)은 doctype/head/body 없이 마크업만 담고 있어야 한다.
   */
  function includePartials() {
    var holders = document.querySelectorAll('[data-include-path]');

    Array.prototype.forEach.call(holders, function (el) {
      var path = el.dataset.includePath;
      if (!path) {
        return;
      }

      var xhr = new XMLHttpRequest();
      // 뒤따르는 초기화가 삽입된 마크업에 의존하므로 동기로 읽는다.
      xhr.open('GET', path, false);
      xhr.send();

      if (xhr.status === 200) {
        el.outerHTML = xhr.responseText;
      } else {
        el.innerHTML = '<p class="content-status">Failed to load layout.</p>';
      }
    });
  }

  /* -------------------------------------------------------------- index */

  function createLeaf(item) {
    var a = document.createElement('a');
    a.href = 'javascript:void(0);';
    a.textContent = item.name;
    a.addEventListener('click', function () {
      setActive(a);
      loadContent(item.file, item.name);
    });
    return a;
  }

  function createBranch(item) {
    var branch = document.createElement('span');
    branch.className = 'index-branch is-collapsed';
    branch.appendChild(document.createTextNode(item.name));
    branch.addEventListener('click', function () {
      branch.classList.toggle('is-collapsed');
    });
    return branch;
  }

  function createTree(items) {
    var ul = document.createElement('ul');

    items.forEach(function (item) {
      var li = document.createElement('li');

      if (item.children) {
        li.appendChild(createBranch(item));

        if (item.children.length) {
          li.appendChild(createTree(item.children));
        } else {
          var empty = document.createElement('ul');
          var emptyLi = document.createElement('li');
          var emptySpan = document.createElement('span');
          emptySpan.className = 'index-empty content-status';
          emptySpan.textContent = '(준비 중)';
          emptyLi.appendChild(emptySpan);
          empty.appendChild(emptyLi);
          li.appendChild(empty);
        }
      } else if (item.file) {
        li.appendChild(createLeaf(item));
      } else {
        li.textContent = item.name;
      }

      ul.appendChild(li);
    });

    return ul;
  }

  function renderIndex() {
    if (!els.indexTree) {
      return;
    }
    els.indexTree.innerHTML = '';

    var tree = createTree(CONTENTS);
    while (tree.firstChild) {
      els.indexTree.appendChild(tree.firstChild);
    }
  }

  function setActive(link) {
    if (activeLink) {
      activeLink.classList.remove('is-active');
    }
    activeLink = link;
    if (activeLink) {
      activeLink.classList.add('is-active');
    }
  }

  /* ------------------------------------------------------------ content */

  function setTitle(text) {
    if (els.contentTitle) {
      els.contentTitle.textContent = text;
    }
  }

  function loadContent(file, title) {
    if (!els.contentBody || !file) {
      return;
    }

    setTitle(title || 'Contents');
    els.contentBody.innerHTML = '<p class="content-status">Loading...</p>';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', POSTS_PATH + file, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        els.contentBody.innerHTML = xhr.responseText;
        window.scrollTo(0, 0);
      } else {
        els.contentBody.innerHTML = '<p class="content-status">Error loading content.</p>';
      }
    };
    xhr.onerror = function () {
      els.contentBody.innerHTML = '<p class="content-status">Error loading content.</p>';
    };
    xhr.send();
  }

  function showHome() {
    setActive(null);
    setTitle('Home');

    var template = document.getElementById('home-template');
    if (els.contentBody && template) {
      els.contentBody.innerHTML = '';
      els.contentBody.appendChild(template.content.cloneNode(true));
    }
  }

  /* --------------------------------------------------------------- init */

  function bindSidebarToggle() {
    var button = document.querySelector('.sidebar-toggle');
    if (!button || !els.indexTitle) {
      return;
    }
    button.addEventListener('click', function () {
      els.indexTitle.classList.toggle('is-collapsed');
    });
  }

  function init() {
    els.indexTree = document.getElementById('index-tree');
    els.indexTitle = document.getElementById('index-title');
    els.contentTitle = document.getElementById('content-title');
    els.contentBody = document.getElementById('content-body');

    renderIndex();
    bindSidebarToggle();
    showHome();

    var retrospective = document.getElementById('retrospective');
    if (retrospective) {
      retrospective.addEventListener('click', showHome);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    includePartials();
    init();
  });

  // posts/*.html 안에서 직접 호출할 수 있도록 남겨둔다.
  window.loadContent = loadContent;
})();
