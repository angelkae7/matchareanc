import { motion } from "framer-motion";


export default function Stars() {
  return (
      <div>
        <motion.div initial={{ y: 0, x : 180}} animate={{ y: -80,  opacity: 0 }} transition={{ delay: 0, duration: 1, repeat: Infinity, repeatType: "reverse" }} className="star">⭐</motion.div> 
        <motion.div initial={{ y: 0, x : 400}} animate={{ y: -80,  opacity: 0 }} transition={{ delay: 0.2, duration: 1, repeat: Infinity, repeatType: "reverse" }} className="star">⭐</motion.div> 
        <motion.div initial={{ y: 0, x : 40}} animate={{ y: -80,  opacity: 0 }} transition={{ delay: 0.4, duration: 1, repeat: Infinity, repeatType: "reverse" }} className="star">⭐</motion.div>
      </div>
  );
}