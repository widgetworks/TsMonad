export function writer(story, value) {
    return Writer.writer(story, value);
}
export class Writer {
    story;
    value;
    constructor(story, value) {
        this.story = story;
        this.value = value;
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
    of = this.unit;
    chain = this.bind;
    fmap(f) {
        return this.bind(v => this.unit(f(v)));
    }
    lift = this.fmap;
    map = this.fmap;
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