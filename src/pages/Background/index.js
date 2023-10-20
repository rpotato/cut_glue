console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.action.onClicked.addListener(e => { splitTabs(e) });

async function moveTabsToWin(tabs, win) {
    if (!!win) {
        await Promise.all(tabs.map(t => {
            if (t.id)
                return chrome.tabs.move(t.id, { windowId: win.id, index: -1 })
        }));
    }
}

async function removeFirstTab(win) {
    if (!!win) {
        var d = (await chrome.tabs.query({ windowId: win.id, index: 0 }))[0];
        d.id && chrome.tabs.remove(d.id)
    }
}

async function splitTabs(e) {
    var tabs = await chrome.tabs.query({ windowId: e.windowId });
    if (!(tabs.length < 2)) {
        var o = tabs.filter(i => i.index >= e.index);
        chrome.windows.create({}, async win => {
            await moveTabsToWin(o, win);
            await removeFirstTab(win);
        })
    }
}
