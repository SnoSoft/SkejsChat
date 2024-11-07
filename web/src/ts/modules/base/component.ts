"use strict";
import { SkejsLog } from "./skejs-logger";
export type TSkejsComponent = {
    name: string;
    node: Node;
}
const componentsQuery : NodeListOf<Element> = document.querySelectorAll(".component");
const components : Array<TSkejsComponent> = [];
const slc = new SkejsLog("SkejsComponent");

componentsQuery.forEach((i : Element) => {
    if (!i.hasAttribute("data-component-name")) {
        slc.error("A component that has the component class does not have a name in the DOM!");
        return;
    }
    if (!i.hasAttribute("data-component-is-generic")) {
        i.parentNode!.removeChild(i);
        i.setAttribute("data-component-is-generic", "");
        components.push({
            name: i.getAttribute("data-component-name")!,
            node: i
        });
    }
});

export class SkejsComponent {
    findComponent(sourceName : string) : TSkejsComponent {
        for (let i=0; i < components.length; i++) {
            if (components[i].name === sourceName) return components[i];
        }
        throw new Error(`SkejsComponent: Could not find component with name ${sourceName}`)
    };

    // Preferably you shouldn't use this as it returns a node which retains some attributes which are wrong
    // and can only be corrected for in createElement(). Use that instead.
    createNode(sourceName : string) : Node {
        const inNode = this.findComponent(sourceName);
        const outNode = inNode.node.cloneNode(true);
        return outNode;
    };
    createElement(sourceName : string) : Element {
        const outNode = this.createNode(sourceName);
        (outNode as Element).removeAttribute("data-component-is-generic");
        return (outNode as Element);
    }
    insertAfter(referenceNode : Node, sourceName : string, id : string = "") : Element {  // Insert component after a node, return new node made from component.
        if (referenceNode.parentNode === null) {
            throw new Error("SkejsComponent.insertAfter: Reference node has no parent node, and has no way to insert the component after it.");
        }
        const outEl = this.createElement(sourceName);
        outEl.id = id;
        referenceNode.parentNode.insertBefore(outEl, referenceNode.nextSibling);
        
        return outEl;
    };
    appendChild(referenceNode : Node, sourceName : string, id : string = "") : Element {
        const outEl = this.createElement(sourceName);
        outEl.id = id;
        referenceNode.appendChild(outEl);
        return outEl;
    };
}

export const sc = new SkejsComponent();