export function writer(story, value) {
    return Writer.writer(story, value);
}
export class Writer {
    constructor(story, value) {
        this.story = story;
        this.value = value;
        this.of = this.unit;
        this.chain = this.bind;
        this.lift = this.fmap;
        this.map = this.fmap;
    }
    static writer(story, value) {
        return new Writer(story, value);
    }
    static tell(s) {
        return new Writer([s], 0);
    }
    unit(u) {
        return new Writer([], u);
    }
    bind(f) {
        var wu = f(this.value), newStory = this.story.concat(wu.story);
        return new Writer(newStory, wu.value);
    }
    fmap(f) {
        return this.bind(v => this.unit(f(v)));
    }
    caseOf(patterns) {
        return patterns.writer(this.story, this.value);
    }
    equals(other) {
        var i, sameStory = true;
        for (i = 0; i < this.story.length; i += 1) {
            sameStory = sameStory && this.story[i] === other.story[i];
        }
        return sameStory && this.value === other.value;
    }
}
//# sourceMappingURL=writer.js.map