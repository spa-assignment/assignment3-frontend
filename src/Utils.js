import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

/**
 * Utils class
 */
class Utils {

    /**
     * Fade in the element from the top 
     * 
     * @param {string} selector 
     */
    fadeInFromTop(selector) {
        const el = document.querySelector(selector);
        if (el) {
            const timeline = gsap.timeline()
            timeline.fromTo(
                el, {
                    opacity: 0,
                    y: -50,
                }, {
                    opacity: 1,
                    y: 0,
                    ease: "power2.out",
                    duration: 0.5,
                    delay: 1,
                    clearProps: "all"
                }
            );

            return timeline
        }
    }

    /**
     * Fade in the element from the top 
     * 
     * @param {string} targetsSelector 
     */
    fadeInFromTopStaggered(targetsSelector, timeline=null, duration=1, stagger=0.5) {
        const els = document.querySelectorAll(targetsSelector);
        if (els.length !== 0) {
            if (timeline) {
                timeline.from(targetsSelector, { y: -120, opacity: 0, duration: duration, ease: "power3.out", stagger: stagger, clearProps: "all" });
                return timeline
            } else {
                const timeline = gsap.timeline()
                timeline.from(targetsSelector, { y: -120, opacity: 0, duration: duration, ease: "power3.out", stagger: stagger, clearProps: "all" });
                return timeline
            }
        }
    }

    /**
     * Fade in the elements (staggered) from center on scroll 
     * 
     * @param {string} triggerSelector 
     * @param {string} targetsSelector 
     */
    fadeInFromCenterOnScrollStaggered(triggerSelector, targetsSelector, start="top top") {
        if (document.querySelector(triggerSelector) && 
            document.querySelectorAll(targetsSelector).length !== 0){
            let timeline = gsap.timeline({
                scrollTrigger: {
                trigger: triggerSelector,
                start: start,
                }
            });
            
            timeline.from(targetsSelector, { y: -120, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.5, clearProps: "all" })
        }
    }
}

// Export an instance of Utils class
export default new Utils();