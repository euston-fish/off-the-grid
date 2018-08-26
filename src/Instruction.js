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
export const Instruction = function(name, code, impact) {
  this.name = name;
  this.code = code;
  this.impact = impact;
  if (typeof document !== 'undefined') {
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
  }
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
  let index = buttons.indexOf(this);
  if (index > -1) {
    buttons.splice(index, 1);
  }
};

Instruction.prototype.placed = function() {
  this.className = 'instruction placed';
};

Instruction.prototype.canApplyTo = function({'water': water}) {
  return water < 0;
};

const TYPES = [
  'Water',
  'Grow',
  'Plant',
];

Instruction.randomInstruction = () => {
  let idx = Math.floor(Math.random() * TYPES.length);
  return new Instruction(
    TYPES[idx],
    idx,
    Math.random());
};

Instruction.fromCodeAndIntensity = (code, impact) => {
  let type = TYPES[code];
  let instruction = new Instruction(type, code, impact);
  return instruction;
};
