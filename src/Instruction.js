let toolbar;
let onActiveChangedCallback = null;
let buttons = [];

export const initializeToolbar = (id) => {
  toolbar = document.getElementById(id);
};

export const getActiveInstructions = () => buttons;
export const onActiveChanged = (callback) => onActiveChangedCallback = callback;

/**
 * @constructor
 */
export const Instruction = function(name, impact) {
  this.name = name;
  this.impact = impact;
  let node = document.createElement('div');
  node.innerText = this.name;
  node.className = 'instruction';
  let javascriptIsDumb = this;
  node.addEventListener('click', () => {
    let wasActive = javascriptIsDumb.isActive;
    buttons.forEach(butt => butt.setActive(false));
    javascriptIsDumb.setActive(!wasActive);
    if (onActiveChangedCallback) onActiveChangedCallback(wasActive ? null : javascriptIsDumb);
  });
  this.node = node;
  buttons.push(this);
};

Instruction.prototype.setActive = function(isActive) {
  this.isActive = isActive;
  this.node.className = 'instruction' + (isActive ? ' active' : '');
};

Instruction.prototype.addToToolbar = function() {
  toolbar.appendChild(this.node);
};

Instruction.prototype.remove = function() {
  toolbar.removeChild(this.node);
  let index = buttons.indexOf(this.node);
  if (index > -1) {
    buttons.splice(index, 1);
  }
};

const TYPES = [
  'THingness',
  'Stuffyness',
  'Moredoodles',
  'Deadliness',
];

Instruction.randomInstruction = () => {
  return new Instruction(
    TYPES[Math.floor(Math.random() * TYPES.length)],
    Math.random());
};
