const componentsQuery = document.querySelectorAll(".component");
const components = [];
const slc = new SkejsLog("SkejsComponent");

componentsQuery.forEach((i) => {
    if (!i.hasAttribute("data-component-name")) {
        slc.error("A component that has the component class does not have a name in the DOM!");
        return;
    }
    if (!i.hasAttribute("data-component-is-generic")) {
        i.parentNode.removeChild(i);
        i.setAttribute("data-component-is-generic", "");
        components.push({
            name: i.getAttribute("data-component-name"),
            node: i
        });
    }
});

class SkejsComponent {
    findComponent(sourceName) {
        for (let i=0; i < components.length; i++) {
            if (components[i].name === sourceName) return components[i];
        }
    };
    createNode(sourceName, id="") {
        const inNode = this.findComponent(sourceName);
        const outNode = inNode.node.cloneNode(true);
        if (id) outNode.setAttribute("id", id);
        return outNode
    };
    insertAfter(referenceNode, sourceName, id="") {  // Insert component after a node, return new node made from component.
        const outNode = this.createNode(sourceName, id);
        referenceNode.parentNode.insertBefore(outNode, referenceNode.nextSibling);
        return outNode;
    };
    appendChild(referenceNode, sourceName, id="") {
        const outNode = this.createNode(sourceName, id);
        referenceNode.appendChild(outNode);
        return outNode;
    }
}

const sc = new SkejsComponent();