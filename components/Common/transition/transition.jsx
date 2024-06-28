import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0,
    },
  },
  out: {
    opacity: 0,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/animated-page-transitions-in-nextjs
 */
const TransitionEffect = ({ children }) => {
  const { asPath } = useRouter();

  return (
    <div>
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div key={asPath} variants={variants} animate="in" initial="out" exit="out">
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransitionEffect;
