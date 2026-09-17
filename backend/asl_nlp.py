# asl_nlp.py

import threading
import importlib.util
import time
import requests

# ──────────────────────────────────────────────
# WORD CATEGORIES (100 CLASS DICTIONARY MAPPING)
# ──────────────────────────────────────────────
SUBJECTS = {
    "man": "the man",
    "woman": "the woman",
    "son": "my son",
    "mother": "my mother",
    "cousin": "my cousin",
    "secretary": "the secretary",
    "doctor": "the doctor",
    "deaf": "the deaf person",
    "hearing": "the hearing person",
    "family": "my family",
    "dog": "the dog",
    "cat": "the cat",
    "bird": "the bird",
    "cow": "the cow",
    "fish": "the fish"
}

VERBS = {
    "can": "can",
    "change": "change",
    "cheat": "cheat",
    "cook": "cook",
    "dance": "dance",
    "decide": "decide",
    "drink": "drink",
    "eat": "eat",
    "enjoy": "enjoy",
    "finish": "finish",
    "forget": "forget",
    "give": "give",
    "go": "go",
    "graduate": "graduate",
    "help": "help",
    "kiss": "kiss",
    "like": "like",
    "meet": "meet",
    "need": "need",
    "paint": "paint",
    "play": "play",
    "pull": "pull",
    "study": "study",
    "tell": "tell",
    "walk": "walk",
    "want": "want",
    "work": "work",
    "wrong": "go wrong"
}

PAST_VERBS = {
    "can": "could",
    "change": "changed",
    "cheat": "cheated",
    "cook": "cooked",
    "dance": "danced",
    "decide": "decided",
    "drink": "drank",
    "eat": "ate",
    "enjoy": "enjoyed",
    "finish": "finished",
    "forget": "forgot",
    "give": "gave",
    "go": "went",
    "graduate": "graduated",
    "help": "helped",
    "kiss": "kissed",
    "like": "liked",
    "meet": "met",
    "need": "needed",
    "paint": "painted",
    "play": "played",
    "pull": "pulled",
    "study": "studied",
    "tell": "told",
    "walk": "walked",
    "want": "wanted",
    "work": "worked",
    "wrong": "went wrong"
}

FOODS = {"apple", "candy", "corn", "pizza", "orange", "fish"}
TOYS_SPORTS = {"basketball", "book", "chair", "computer", "clothes", "jacket", "shirt", "hat", "medicine", "paper", "table", "bowling"}
LOCATIONS = {"bed", "city", "school", "africa"}
TIME_EXPS = {"before", "later", "now", "thursday", "thanksgiving", "time", "year", "last"}
COLORS = {"black", "blue", "brown", "orange", "pink", "purple", "white"}
ADJECTIVES = {"cool", "dark", "fine", "full", "hot", "short", "tall", "thin", "wrong", "right", "same"}
QUESTION_WORDS = {"what", "who", "how"}

# ──────────────────────────────────────────────
# SYSTEM UTILITIES
# ──────────────────────────────────────────────
def is_transformers_available():
    return importlib.util.find_spec("transformers") is not None and importlib.util.find_spec("torch") is not None

# ──────────────────────────────────────────────
# TRANSLATION SYSTEM (ZERO-OVERHEAD WEB API)
# ──────────────────────────────────────────────
def translate_text(text, target_lang):
    if not text or target_lang == 'en':
        return text

    lang_map = {
        'en': 'en',
        'hi': 'hi',
        'fr': 'fr',
        'es': 'es',
        'de': 'de'
    }
    
    tl = lang_map.get(target_lang, 'en')
    try:
        url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={tl}&dt=t&q={text}"
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            res = r.json()
            translated = "".join([item[0] for item in res[0] if item[0]])
            return translated.strip()
    except Exception as e:
        print(f"Translation Error ({tl}): {e}")
    return text

# ──────────────────────────────────────────────
# LOCAL SYNTACTIC PARSER & THREE-TENSE GENERATOR
# ──────────────────────────────────────────────
class ASLRefiner:
    """
    Highly optimized, rule-based syntactic/semantic engine tailored for the 100 ASL classes.
    Reconstructs natural English sentences and maps tenses with sub-millisecond execution.
    """
    def __init__(self):
        pass

    def clean_sequence(self, words):
        cleaned = []
        for w in words:
            w = w.lower().strip()
            if not cleaned or w != cleaned[-1]:
                cleaned.append(w)
        return cleaned

    def parse_elements(self, cleaned_words):
        subject = None
        verb = None
        direct_object = None
        adjective_list = []
        color_list = []
        location = None
        time_exp = None
        is_question = False
        question_word = None

        for w in cleaned_words:
            if w in QUESTION_WORDS:
                is_question = True
                question_word = w
            elif w in SUBJECTS and subject is None:
                subject = SUBJECTS[w]
            elif w in VERBS and verb is None:
                verb = w
            elif w in FOODS or w in TOYS_SPORTS:
                if direct_object is None:
                    direct_object = w
            elif w in LOCATIONS and location is None:
                location = w
            elif w in TIME_EXPS and time_exp is None:
                time_exp = w
            elif w in COLORS:
                color_list.append(w)
            elif w in ADJECTIVES:
                adjective_list.append(w)

        # Default fallbacks
        if subject is None:
            subject = "I" if "all" not in cleaned_words else "we"

        # Construct modified subject phrase
        mods = " ".join(adjective_list + color_list)
        if mods:
            if subject in ["I", "we"]:
                subject_phrase = subject
                adj_predicate = f"am {mods}"
            else:
                noun_part = subject.replace('the ', '').replace('my ', '')
                subject_phrase = f"the {mods} {noun_part}"
                adj_predicate = ""
        else:
            subject_phrase = subject
            adj_predicate = ""

        return {
            "subject": subject_phrase,
            "verb": verb,
            "object": direct_object,
            "location": location,
            "time": time_exp,
            "is_question": is_question,
            "question_word": question_word,
            "adj_predicate": adj_predicate
        }

    def refine(self, words):
        cleaned = self.clean_sequence(words)
        if not cleaned:
            return ""

        raw_seq = " ".join(cleaned)
        shortcuts = {
            "hello": "Hello!",
            "hello you": "Hello, how are you?",
            "how you": "How are you?",
            "me need help": "I need help.",
            "need help": "I need help.",
            "me need water": "I need some water.",
            "me want food": "I want some food.",
            "please help": "Please help me.",
            "you need help": "Do you need help?",
            "what you want": "What do you want?",
            "thank you": "Thank you.",
            "thanks": "Thank you.",
            "sorry": "I am sorry.",
            "yes": "Yes.",
            "no": "No.",
            "goodbye": "Goodbye.",
            "congratulations": "Congratulations!",
            "fine": "I am doing fine.",
            "wrong": "Something is wrong.",
            "study computer": "I am studying on the computer.",
            "play basketball": "Let's play basketball.",
            "play bowling": "Let's go bowling.",
            "go school": "I am going to school.",
            "go city": "I am going to the city.",
            "deaf man": "The man is deaf.",
            "accident happen": "An accident happened."
        }

        if raw_seq in shortcuts:
            return shortcuts[raw_seq]

        elem = self.parse_elements(cleaned)
        return self.construct_tense(elem, "present")

    def construct_tense(self, elem, tense):
        subj = elem["subject"]
        verb = elem["verb"]
        obj = elem["object"]
        loc = elem["location"]
        time_val = elem["time"]
        is_q = elem["is_question"]
        q_word = elem["question_word"]
        adj_pred = elem["adj_predicate"]

        # Verb conjugations per tense
        is_third_person = subj not in ["I", "we"] and not is_q
        
        verb_phrase = ""
        if verb:
            if tense == "present":
                # Continuous / Present simple
                if verb == "go":
                    verb_phrase = "is going to" if is_third_person else ("am going to" if subj == "I" else "are going to")
                else:
                    present_conjs = {
                        "want": "wants to" if is_third_person else "want to",
                        "need": "needs to" if is_third_person else "need to",
                        "like": "likes to" if is_third_person else "like to",
                        "enjoy": "enjoys" if is_third_person else "enjoy",
                        "can": "can",
                        "finish": "has finished" if is_third_person else "have finished",
                        "graduate": "graduated from",
                        "study": "is studying" if is_third_person else "am studying",
                        "work": "is working" if is_third_person else "am working",
                        "dance": "is dancing" if is_third_person else "am dancing",
                        "cook": "is cooking" if is_third_person else "am cooking",
                        "play": "is playing" if is_third_person else "am playing",
                        "drink": "is drinking" if is_third_person else "am drinking",
                        "eat": "is eating" if is_third_person else "am eating",
                        "walk": "is walking" if is_third_person else "am walking"
                    }
                    verb_phrase = present_conjs.get(verb, verb + "s" if is_third_person else verb)
            
            elif tense == "past":
                past_form = PAST_VERBS.get(verb, verb + "ed")
                if verb == "go":
                    verb_phrase = "went to"
                elif past_form == "want to":
                    verb_phrase = "wanted to"
                elif past_form == "need to":
                    verb_phrase = "needed to"
                elif past_form == "like to":
                    verb_phrase = "liked to"
                else:
                    verb_phrase = past_form
                    
            elif tense == "future":
                if verb == "can":
                    verb_phrase = "will be able to"
                elif verb == "go":
                    verb_phrase = "will go to"
                elif verb in ["want", "need", "like", "enjoy"]:
                    verb_phrase = f"will {verb} to" if verb != "enjoy" else "will enjoy"
                else:
                    verb_phrase = f"will {verb}"
        else:
            # Auxiliary verb fallback
            if adj_pred:
                if tense == "present":
                    verb_phrase = "is" if is_third_person else ("am" if subj == "I" else "are")
                elif tense == "past":
                    verb_phrase = "was" if is_third_person else ("was" if subj == "I" else "were")
                elif tense == "future":
                    verb_phrase = "will be"
            elif obj or loc:
                if tense == "present":
                    verb_phrase = "wants" if is_third_person else "want"
                elif tense == "past":
                    verb_phrase = "wanted"
                elif tense == "future":
                    verb_phrase = "will want"

        # Object phrasing
        obj_phrase = ""
        if obj:
            if obj in FOODS:
                obj_phrase = f"an {obj}" if obj in ["apple", "orange"] else obj
            elif obj in TOYS_SPORTS:
                if obj in ["basketball", "bowling"]:
                    obj_phrase = obj
                else:
                    obj_phrase = f"the {obj}"

        # Location phrasing: strip prepositions if verb phrase already has "to"
        loc_phrase = ""
        if loc:
            if verb_phrase and verb_phrase.endswith("to"):
                if loc == "city":
                    loc_phrase = "the city"
                elif loc == "africa":
                    loc_phrase = "Africa"
                else:
                    loc_phrase = loc
            else:
                loc_maps = {"bed": "in bed", "school": "at school", "city": "to the city", "africa": "in Africa"}
                loc_phrase = loc_maps.get(loc, f"at {loc}")

        # Assemble elements
        parts = []
        if is_q:
            if q_word == "how":
                be_verb = "is"
                if tense == "past": be_verb = "was"
                elif tense == "future": be_verb = "will be"
                
                if tense == "future":
                    parts.extend(["How", "will", subj, "be"])
                else:
                    parts.extend(["How", be_verb, subj])
                    
                if verb_phrase and verb_phrase not in ["is", "was", "will be", "am", "are"]:
                    parts.append(verb_phrase.replace("is ", "").replace("am ", ""))
            
            elif q_word == "who":
                parts.extend(["Who", verb_phrase if verb_phrase else ("is" if tense == "present" else "was")])
                if obj_phrase: parts.append(obj_phrase)
                if loc_phrase: parts.append(loc_phrase)
            
            elif q_word == "what":
                be_verb = "is" if tense == "present" else ("was" if tense == "past" else "will be")
                if tense == "future":
                    parts.extend(["What", "will", subj, "be"])
                else:
                    parts.extend(["What", be_verb, subj])
                if verb_phrase and verb_phrase not in ["is", "was", "will be"]:
                    parts.append(verb_phrase.replace("is ", "").replace("am ", ""))
                if obj_phrase: parts.append(obj_phrase)
                if loc_phrase: parts.append(loc_phrase)
        else:
            if time_val in ["now", "today", "thursday"]:
                t_val = time_val
                if tense == "past" and time_val == "now": t_val = "just then"
                elif tense == "future" and time_val == "now": t_val = "soon"
                parts.append(t_val.capitalize() + ",")
            
            parts.append(subj.capitalize())
            
            if adj_pred and verb_phrase in ["is", "am", "are", "was", "were", "will be"]:
                parts.append(adj_pred.replace("am", verb_phrase))
            else:
                if verb_phrase: parts.append(verb_phrase)
                if obj_phrase: parts.append(obj_phrase)
                if loc_phrase: parts.append(loc_phrase)
            
            if time_val and time_val not in ["now", "today", "thursday"]:
                parts.append(time_val)

        sentence = " ".join([p for p in parts if p]).strip()
        if not sentence:
            return ""

        # Double verb cleanups
        sentence = sentence.replace("I am am", "I am")
        sentence = sentence.replace("will will", "will")
        
        # Punctuate
        if is_q:
            if not sentence.endswith("?"): sentence += "?"
        else:
            if not sentence.endswith("."): sentence += "."

        return sentence

# ──────────────────────────────────────────────
# ASYNCHRONOUS T5 PIPELINE FOR NEURAL TRANSLATION
# ──────────────────────────────────────────────
class T5PipelineWrapper:
    def __init__(self):
        if not is_transformers_available():
            raise ImportError("transformers and PyTorch are not installed")
        
        transformers = importlib.import_module("transformers")
        AutoTokenizer = getattr(transformers, "AutoTokenizer")
        AutoModelForSeq2SeqLM = getattr(transformers, "AutoModelForSeq2SeqLM")
        
        model_name = "mrm8488/t5-small-finetuned-common_gen"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

    def generate(self, concepts_str):
        prompt = f"generate sentence: {concepts_str}"
        inputs = self.tokenizer(prompt, return_tensors="pt")
        outputs = self.model.generate(**inputs, max_length=64)
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text.strip()

# Singleton references
_refiner = ASLRefiner()
_t5_model = None
_t5_loading_thread = None
_t5_state = "unloaded"

def load_t5_async():
    global _t5_model, _t5_state, _t5_loading_thread
    if _t5_state in ["loading", "loaded"]:
        return

    _t5_state = "loading"
    
    def target():
        global _t5_model, _t5_state
        try:
            if is_transformers_available():
                _t5_model = T5PipelineWrapper()
                _t5_state = "loaded"
            else:
                _t5_state = "failed"
        except Exception:
            _t5_state = "failed"

    _t5_loading_thread = threading.Thread(target=target, daemon=True)
    _t5_loading_thread.start()

def get_t5_state():
    return _t5_state

def get_nlp_sentence(words, use_t5=False, t5_callback=None):
    local_sentence = _refiner.refine(words)
    
    if use_t5 and len(words) > 0:
        global _t5_model, _t5_state
        if _t5_state == "loaded" and _t5_model:
            concepts = " ".join(_refiner.clean_sequence(words))
            
            def run_t5():
                try:
                    t5_res = _t5_model.generate(concepts)
                    if t5_callback and t5_res:
                        t5_callback(t5_res)
                except Exception:
                    pass
            
            threading.Thread(target=run_t5, daemon=True).start()
        elif _t5_state == "unloaded":
            load_t5_async()
            
    return local_sentence

def get_three_tenses(words):
    cleaned = _refiner.clean_sequence(words)
    if not cleaned:
        return {"present": "", "past": "", "future": ""}
    
    elem = _refiner.parse_elements(cleaned)
    return {
        "present": _refiner.construct_tense(elem, "present"),
        "past": _refiner.construct_tense(elem, "past"),
        "future": _refiner.construct_tense(elem, "future")
    }
