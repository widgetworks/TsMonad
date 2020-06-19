"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function writer(story, value) {
    return Writer.writer(story, value);
}
exports.writer = writer;
var Writer = (function () {
    function Writer(story, value) {
        this.story = story;
        this.value = value;
        this.of = this.unit;
        this.chain = this.bind;
        this.lift = this.fmap;
        this.map = this.fmap;
    }
    Writer.writer = function (story, value) {
        return new Writer(story, value);
    };
    Writer.tell = function (s) {
        return new Writer([s], 0);
    };
    Writer.prototype.unit = function (u) {
        return new Writer([], u);
    };
    Writer.prototype.bind = function (f) {
        var wu = f(this.value), newStory = this.story.concat(wu.story);
        return new Writer(newStory, wu.value);
    };
    Writer.prototype.fmap = function (f) {
        var _this = this;
        return this.bind(function (v) { return _this.unit(f(v)); });
    };
    Writer.prototype.caseOf = function (patterns) {
        return patterns.writer(this.story, this.value);
    };
    Writer.prototype.equals = function (other) {
        var i, sameStory = true;
        for (i = 0; i < this.story.length; i += 1) {
            sameStory = sameStory && this.story[i] === other.story[i];
        }
        return sameStory && this.value === other.value;
    };
    return Writer;
}());
exports.Writer = Writer;
//# sourceMappingURL=writer.js.map